# Report format

Use this compact structure:

```markdown
Verdict: READY | NOT READY | INCOMPLETE

Evidence
- passed [fresh] `<exact command>` — <exact concise observed result>
- failed [fresh] `<exact command>` — <exact concise observed result>
- skipped — <check> — <explicit reason or rule>
- unavailable — <check> — <concrete environment reason>
- historical — `<command>` — <source and exact supplied result>; not rerun

Findings
- <material failure or evidence gap, highest severity first>

Scope
- Checked: <changed behavior and relevant files>
- Not checked: <material exclusions>
```

Omit empty sections except `Evidence` and `Scope`. Do not add a READY verdict when `Findings` contains a material gap. Do not collapse counts or normalize exact result wording.
