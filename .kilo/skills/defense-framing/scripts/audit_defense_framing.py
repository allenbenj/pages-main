#!/usr/bin/env python3
"""Structural defense framing audit. Does not determine truth or filing readiness."""
import argparse,json,hashlib,re,subprocess,sys
from pathlib import Path

def audit(packet,source_root=None,verify_files=False,court_facing=False):
    issues=[]
    def hit(sev,code,where,reason):issues.append(dict(severity=sev,rule=code,location=where,message=reason))
    for field in ('schema_version','objective','stage','audience','sources','claims','frames','review'):
        if field not in packet: hit('BLOCKER','SCHEMA',field,'Missing field')
    sources={s.get('id'):s for s in packet.get('sources',[]) if isinstance(s,dict)}
    claims={c.get('id'):c for c in packet.get('claims',[]) if isinstance(c,dict)}
    authority={a.get('id'):a for a in packet.get('authorities',[]) if isinstance(a,dict)}
    if not packet.get('frames'):hit('BLOCKER','EMPTY','frames','No defensible frame supplied')
    for c in packet.get('claims',[]):
        cid=c.get('id','?');kind=c.get('kind')
        if kind not in ('verified_fact','attributed_statement','disputed_allegation','inference','legal_rule','conclusion','unknown'):
            hit('BLOCKER','CLASS',cid,'Missing/invalid evidence class')
        refs=c.get('source_refs',[])
        if kind in ('verified_fact','attributed_statement','disputed_allegation') and not refs:hit('BLOCKER','PIN',cid,'Evidence statement missing source and locator')
        for ref in refs:
            if ref.get('source_id') not in sources:hit('BLOCKER','SOURCE',cid,'Unknown source reference')
            if not ref.get('locator'):hit('BLOCKER','LOCATOR',cid,'Missing pinpoint locator')
        if kind=='legal_rule' and not c.get('authority_ids'):hit('BLOCKER','LEGAL',cid,'Legal rule lacks authority')
    for a in authority.values():
        if court_facing and a.get('status')!='reliance_approved':hit('BLOCKER','AUTHORITY',a.get('id'),'Court-facing authority not reliance approved')
    for f in packet.get('frames',[]):
        fid=f.get('id','?')
        for field in ('thesis','state_best_case','element','next_proof_step','remedy','risk','weakest_link','falsifier'):
            if not f.get(field):hit('BLOCKER','FRAME',fid,'Missing '+field)
        if not f.get('adverse_claim_ids'):hit('BLOCKER','ADVERSE',fid,'Missing adverse evidence')
        if not f.get('inferences'):hit('BLOCKER','CAUSAL',fid,'No inference chain')
        for field in ('claim_ids','adverse_claim_ids'):
            for cid in f.get(field,[]):
                if cid not in claims:hit('BLOCKER','CLAIM_REF',fid,'Unknown claim '+str(cid))
        for aid in f.get('authority_ids',[]):
            if aid not in authority:hit('BLOCKER','AUTH_REF',fid,'Unknown authority '+str(aid))
            elif court_facing and authority[aid].get('status')!='reliance_approved':hit('BLOCKER','AUTHORITY',fid,'Unverified authority used in filing')
        for i in f.get('inferences',[]):
            if not i.get('warrant') or not i.get('alternative'):hit('BLOCKER','INFERENCE',fid,'Inference missing warrant or alternative')
            for cid in i.get('from_claim_ids',[])+([i['to_claim_id']] if i.get('to_claim_id') else []):
                if cid not in claims:hit('BLOCKER','INFERENCE_REF',fid,'Unknown claim '+str(cid))
    if verify_files:
        if not source_root:hit('BLOCKER','INPUT','--source-root','File verification requested without source root')
        else:
            root=Path(source_root).resolve()
            for sid,s in sources.items():
                rp=s.get('path','');p=(root/rp).resolve()
                if not p.is_relative_to(root):hit('BLOCKER','TRAVERSAL',sid,'Source outside trusted root');continue
                if not p.is_file():hit('BLOCKER','MISSING_FILE',sid,'Source file not found');continue
                data=p.read_bytes(); h=hashlib.sha256(data).hexdigest()
                if h.lower()!=s.get('sha256','').lower():hit('BLOCKER','HASH',sid,'Source hash mismatch')
                try:txt=data.decode('utf-8-sig')
                except UnicodeDecodeError:txt=None
                for c in packet.get('claims',[]):
                    for ref in c.get('source_refs',[]):
                        if ref.get('source_id')==sid and ref.get('exact_quote'):
                            if txt is None:hit('REVIEW','BINARY_QUOTE',c.get('id'),'Requires human review of non-text source')
                            elif ref['exact_quote'] not in txt:hit('BLOCKER','QUOTE',c.get('id'),'Exact quote not present in source')
    hit('REVIEW','HUMAN','packet','Source meaning, legal analysis, adverse authorities, privilege and filing readiness require independent review')
    return issues

def main():
    ap=argparse.ArgumentParser();ap.add_argument('packet');ap.add_argument('--draft');ap.add_argument('--source-root');ap.add_argument('--verify-files',action='store_true');ap.add_argument('--court-facing',action='store_true');ap.add_argument('--config',help='Scanner config JSON');ap.add_argument('--profile',help='Matter profile JSON');ap.add_argument('--subject-regex',help='Subject regex for scanner');ap.add_argument('--exceptions',help='Reviewed exceptions JSON');ap.add_argument('--json-out');ap.add_argument('--markdown-out');args=ap.parse_args()
    try: packet=json.loads(Path(args.packet).read_text(encoding='utf-8'))
    except (OSError,ValueError) as e:print(e,file=sys.stderr);return 2
    issues=audit(packet,args.source_root,args.verify_files,args.court_facing)
    if args.draft:
        scan=Path(__file__).resolve().parents[3]/'scripts'/'scan_defense_frames.py'
        if not scan.exists():issues.append(dict(severity='BLOCKER',rule='FORENSIC',location=args.draft,message='Forensic scan not installed'))
        else:
            cmd=[sys.executable,str(scan),args.draft,'--json']
            if args.config:cmd.extend(['--config',args.config])
            if args.profile:cmd.extend(['--profile',args.profile])
            if args.subject_regex:cmd.extend(['--subject-regex',args.subject_regex])
            if args.exceptions:cmd.extend(['--exceptions',args.exceptions])
            r=subprocess.run(cmd,capture_output=True,text=True)
            if r.returncode!=0:issues.append(dict(severity='BLOCKER',rule='FORENSIC',location=args.draft,message='Forensic scan failed: '+r.stdout[:1000]+r.stderr[:300]))
    out={'status':'FAIL' if any(i['severity']=='BLOCKER' for i in issues) else 'STRUCTURE_PASS_REVIEW_REQUIRED','issues':issues}
    j=json.dumps(out,indent=2)
    if args.json_out:Path(args.json_out).write_text(j+'\n',encoding='utf-8')
    if args.markdown_out:Path(args.markdown_out).write_text('# Defense framing audit\n\n'+out['status']+'\n\n'+'\n'.join('- {severity}: {rule} ({location}): {message}'.format(**i) for i in issues)+'\n',encoding='utf-8')
    print(j);return 1 if out['status']=='FAIL' else 0
if __name__=='__main__':sys.exit(main())
