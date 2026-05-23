# Cornell Notes

## Topic: Environment Setup

## Date: April 14, 2026

---

### Cue Column (Questions, Keywords, or Prompts)

- How to check if Go is already installed?
- Which package manager and OS were used?
- How to verify Go installation after install?

---

### Notes Section (Main Notes)

- Step 1: Checked existing Go installation using command -v go and go version.
- Step 2: Identified environment using cat /etc/os-release and confirmed apt package manager.
- Step 3: Updated package index with sudo apt update.
- Step 4: Installed Go using sudo apt install -y golang-go.
- Step 5: Verified installation with go version and which go.
- Installed version: go1.22.2 linux/amd64.
- Go binary location: /usr/bin/go.

```cmd command -v go go version cat /etc/os-release command -v apt sudo apt update sudo apt install -y golang-go go version which go ```

---

### Summary Section (Summary of Notes)

Go was installed on Ubuntu 24.04 using apt. The process included checking current installation status, updating package indexes, installing golang-go, and verifying success with go version and which go.