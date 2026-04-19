# AR/AP Dashboard — VP Demo Script

*10 minutes. Conversational. Live demo where indicated.*

---

## 1. The Problem (1 min)

"Right now, our AR and AP data lives in spreadsheets. One spreadsheet per month, one per region, one per team. To answer a simple question like 'who owes us money and how old is it?' takes three emails, a pivot table, and twenty minutes of scrolling."

"We don't have real-time visibility. We don't catch overdue invoices until they are already 60+ days old. And we have no single source of truth for our leadership team."

---

## 2. The Solution (30 sec)

"So I built this — a live AR/AP analytics dashboard. It takes any Excel export from our existing system and turns it into real-time KPIs, aging analysis, and trend tracking. No backend, no database migration, no IT ticket. Just upload the file and the entire picture is ready in under a second."

---

## 3. Live Demo — Upload (1 min)

*[Action: drag and drop the Excel file into the upload zone]*

"Let me show you. Here is a standard invoice export — same format our finance team already produces. I just drop it here."

*[Wait for the data to load]*

"Done. Eighty invoices parsed, categorized, and enriched with aging buckets instantly."

---

## 4. KPIs at a Glance (2 min)

"The top row gives us the four numbers that actually matter."

"Days Sales Outstanding — 38 days. That is how long on average it takes us to collect after a sale."

"Days Payable Outstanding — 42 days. That is how long we take to pay our vendors. Healthy spread."

"Collection Efficiency — 94.8%. Nearly everything we are owed is either collected or on track."

"And the Deficit Alert Ratio — 12.4%. That is our overdue exposure. This number glows red when it crosses a threshold so nobody has to hunt for problems."

"Every card shows trend direction versus last period, so we know if we are improving or slipping without running a report."

---

## 5. Visual Analytics (2 min)

*[Action: gesture toward the charts]*

"The Flow Projection chart shows our receivables versus payables over the last 30 days. Receivables in green, payables in red. We can spot cash flow gaps before they happen."

"The Aging Dynamics chart breaks outstanding amounts by bucket — Current, 1 to 30 days, 31 to 60, and 60-plus. This is the exact view our auditors ask for every quarter, except now it updates live instead of once a month."

---

## 6. Drill Down — Vendor Detail (2 min)

*[Action: scroll to the transaction table, click a vendor name]*

"Here is the part that changes how our team actually works. Every vendor name in the table is clickable."

*[Click vendor name, e.g., AETHER_DYNAMICS]*

"This takes me straight to the vendor's page. I see only their pending invoices, total outstanding amount, and how many are overdue."

"And right here — Open Vendor Portal. One click, and I am on their site downloading the actual invoices. No more copy-pasting vendor names into Google, hunting for login pages, or wondering if we missed a statement."

*[Action: click back to dashboard]*

"This turns a two-hour monthly reconciliation into a five-minute review."

---

## 7. Closing Ask (30 sec)

"This runs entirely in the browser. No infrastructure cost, no security review cycle, no dependency on engineering bandwidth. We can deploy it tomorrow for the entire finance team."

"I am asking for approval to roll it out to the AR team first, gather feedback for two weeks, and then expand to AP and regional leads. Any questions?"

---

## Appendix — Talking Points (if asked)

| Question | Response |
|----------|----------|
| "Can it handle larger files?" | "Tested up to several thousand rows without lag. It is client-side, so performance depends on the machine, not a server." |
| "Is our data safe?" | "Everything stays local. The Excel is parsed in the browser and never uploaded to any server." |
| "Can we connect it to our ERP directly?" | "Not yet, but the architecture is ready. An API feed would replace the upload step without touching the UI." |
| "What is the cost?" | "Zero licensing cost. Built on open-source libraries. Hosting is free via GitHub Pages." |
| "Who maintains it?" | "I built it and can own it. The code is clean, typed, and documented — easy to hand off if needed." |
