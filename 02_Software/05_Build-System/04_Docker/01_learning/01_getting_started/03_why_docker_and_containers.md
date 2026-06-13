# Cornell Notes

## Topic: Why Docker & Containers?

## Date: 25/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Why Containers?

##### Why would we want independent, standardized "application packages"?

**Different Development & Production Environments:** We want to build and test in exactly (!) the same environment as we later run our app in.

**Different Development Environments Within a Team / Company:** Every team meber should have the exactly (!) same environment when working on the same project.

**Clashing Tools / Versions Between Different Projects:** When switching between projects, tools used in project A should not clash with tools used in project B


#### The Problems 

**Environment:** The runtimes, languages, frameworks you need for development

- Development and Production environments differ. This can lead to the "works on my machine" problem.

- Development Environment for Employee A differs from Employee B. This can lead to the "works on my machine" problem.

- Tools and Libraries required for Project A differ from those required for Project B. This can lead to clashing tools and versions when switching between projects.


#### We Want Reliability & Reproducible Environments

We want to have the **exact same environment for development and production** -> This ensures that it works exactly as tested.

It should be easy to **share a common develoment environment** / setup with (new) employees and colleagues.

---

### Summary Section (Summary of Notes)

**A Container:**
- **Standardize** unit for shipping goods
- Can be **moved** with trucks, ships, cranes,...
- **Independent** from other containers
- **Seft-containing**