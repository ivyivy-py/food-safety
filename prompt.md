# Project Prompts Log

This document records the user prompts and requirements for the **NutriSafe ToxiScan Bio-Portal** project in chronological order.

---

### Prompt 1: Initial System Architecture & Clinical Terminal Specification

```text
ROLE: You are a senior full-stack developer working in this existing Vite + React project.

Goal: Build a mobile responsive web tools: check any food additive (E-number, CAS, name), scan full ingredient lists for risks, search by category/concern, look up nutritional profiles of 4,624 Israeli foods, and check pesticide residue limits on crops.

data comes from a remote MCP server (Model Context Protocol, JSON-RPC 2.0 over HTTP):
Endpoint: https://food-mcp-server.rootsbybenda.workers.dev/mcp (put this in one config constant) no need for API key
- Every request is a POST with headers:
  Content-Type: application/json
  Accept: application/json, text/event-stream
- Replies may be plain JSON OR server-sent events. For SSE, read the lines starting
  with "data:" and parse the JSON whose id matches the request id.

UI: To follow the screens from Stitch exactly. Matching the data to the searches.

OUTPUT: Write the two handlers TWICE, in the two shapes this toolchain needs.
 (a) Standalone files at api/ and api/health.js in the PROJECT ROOT, siblings of
     package.json and never inside src/. This is the form Vercel runs.
 (b) If this project has no server.ts, create one. This is the
     form the AI Studio preview runs. Neither form works in the other place, so I need both.


GUARDRAILS: Never write the key into any file, any comment, or the README. Never create a
 variable whose name starts with VITE_. Never print the key, or any part of it, in a
 response or a log. No new npm packages. No database, no login.

CONTEXT: Deployed on Vercel from GitHub. The key lives only in environment variables
 named MCP_SERVER_KEY: AI Studio's Secrets for the preview, Vercel for the live site.

Responses from the endpoint from the various searches looks like this:
 check_additive

Look up a food additive by name, E-number, or CAS number. Returns safety score, ADI (Acceptable Daily Intake), JECFA/EFSA evidence, EU/US/Israel regulatory status, health concerns, allergens, and vegan/halal/kosher compatibility.

query: "E171"
→ Titanium Dioxide; Safety: 3/10 (high concern); ADI: not established (EFSA 2021 withdrawal);
EU: banned as food additive (2022); US: permitted ≤1%; Concerns: genotoxicity (nano)
check_ingredient_list

Scan a packaged-food ingredient list for additive safety and regulatory flags. Returns matched additives, high-risk scores, banned-country notes, allergen warnings, dietary compatibility issues, and an overall food safety assessment.

ingredients: "Sugar, E150d, E621, Citric Acid, E211"
→ Risk: MODERATE — E211 (sodium benzoate) flagged for benzene formation with ascorbic acid;
E621 (MSG) sensitivity concern; E150d (caramel IV) has 4-MEI limit
search_additives

Search food additives by keyword, category, function, dietary status, or health concern. Use for finding preservatives, colorants, sweeteners, allergens, banned additives, or high-risk E-numbers.

query: "banned preservative" → matches BHA (E320), potassium bromate, etc.
check_nutrition

Look up Israeli Ministry of Health nutrition data for a food item in Hebrew or English. Returns per-100g calories, macronutrients, vitamins, minerals, fatty acids, cholesterol, sugars, and fiber.

query: "חומוס" → Calories: 166kcal, Protein: 8.0g, Fat: 9.6g, Carbs: 14.3g, Fiber: 6.0g
check_pesticide_mrl

Check Israeli pesticide maximum residue limits (MRLs) by pesticide, crop, or combined query. Returns active substance, crop, official MRL value in mg/kg, update date, and pending-change notes.

query: "glyphosate wheat" → MRL: 10.0 mg/kg; Status: active; Updated: 2023
```

---

### Prompt 2: GitHub Repository Push

```text
git push https://[REDACTED_GH_TOKEN]@github.com/ivyivy-py/food-safety.git
```

---

### Prompt 3: Full Ingredients Database & Pop-Up Developer Inspector

```text
modify the code to include use the whole database of ingredients in the MCP. and in the Model Context Protocol (MCP) Live Stream Inspector, to display the results in a pop-up window for developer instead.
```

---

### Prompt 4: Prompts Collation & Git Push

```text
1. collate my prompts into prompt.md file located at project root
2. git push
```

---

### Prompt 5: Repository Push With Credentials

```text
git push https://[REDACTED_GH_TOKEN]@github.com/ivyivy-py/food-safety.git
```

---

### Prompt 6: Handle GET Requests on MCP Endpoint

```text
{"jsonrpc":"2.0","error":{"code":-32600,"message":"Method not allowed. Only POST is accepted."},"id":null}
```

---

### Prompt 7: Repository Push With Credentials

```text
git push https://[REDACTED_GH_TOKEN]@github.com/ivyivy-py/food-safety.git
```



