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

---

### Prompt 8: Update MCP Endpoint to Smithery AI

```text
update the MCP endpoint to https://server.smithery.ai/twohalves/food-safety there is no API key needed
```

---

### Prompt 9: Repository Push With Credentials

```text
git push https://[REDACTED_GH_TOKEN]@github.com/ivyivy-py/food-safety.git
```

---

### Prompt 10: In-App MCP Server & Provenance Integration

```text
ROLE: You are a senior full-stack developer working in this existing Vite + React project, NutriSafe ToxiScan. It already has server.ts, which the AI Studio preview runs, and an api/ folder at the project root, which Vercel runs.

GOAL: Replace the offline remote MCP server with a real MCP server inside this app at /api/mcp that serves the bundled demo dataset, and make every screen get its data through that server and say plainly where the data comes from.

OUTPUT:
 1) Add @modelcontextprotocol/sdk at exactly version 1.30.1 and zod at ^4.6.5, and raise the esbuild devDependency to ^0.27.0, which Vite 8 needs. Do not use mcp-handler or @modelcontextprotocol/server: they are built for Web Request handlers, and this app needs one (req, res) handler that both Express and Vercel run. Keep bun.lock as the only lockfile; never add package-lock.json.
 2) Move api/mcp-engine.js and api/ingredients-data.js into api/_lib/ and update every import, including the ones in src/. Vercel turns every file in api/ into a public address unless its folder or file name starts with an underscore.
 3) In api/_lib/mcp-engine.js and api/_lib/ingredients-data.js, make the data say only what is true and make every lookup return null unless exactly one record fits:
    Data: delete the function synthesizeDynamicDossier. Replace every dietary.traceability line such as "ISO-22000 Cert #992-01 · Verified Pure" with "Demo record: no batch or certification data", and every pesticide gauge text that claims a test was run ("Purity Verified", "Chemical Assay Clean", "Ultra-Pure Profile") with a plain status such as "Within demo limits" or "Above demo limit".
    Additive names: each additive answers to its name and chemical name, each with and without any "(...)" part, the text inside the brackets on its own ("MSG", "Vitamin C", "Ace-K", "BHA"), and the singular of a plural name of six letters or more ("lecithins" also gives "lecithin"); ignore names shorter than three letters. Add these label spellings: palm oil and palm fat for INGR-PALM; partially hydrogenated, hydrogenated vegetable oil, hydrogenated soybean oil and trans fat for INGR-TRANSFAT; mono- and diglycerides, mono and diglycerides and monoglycerides for E471; caramel color and caramel colour for E150d; lecithin, soy lecithin and sunflower lecithin for E322; hfcs and glucose-fructose syrup for INGR-HFCS. Never match on the first word of a name.
    checkAdditive, in this order: an E-number typed alone or found as a whole word, after turning "E 211" and "E-211" into "E211"; an exact CAS number; an exact name; the longest name found in the query as whole words; a part of a name of four letters or more that fits exactly one additive. Return null when the query names two different additives, by E-number or by name, or when two additives tie.
    scanIngredientList: flag an additive only when a whole-word E-number (normalised as above) or one of its names appears in the list, and make every keyword check for combinations, banned notes, allergens and dietary flags a whole-word check, so "eggplant" never raises an egg warning.
    checkNutrition: an exact English or Hebrew name, then a query that contains a full name, then a start-of-word part of three letters or more that fits one food only.
    checkPesticideMrl: a pesticide named as a whole word, or its exact CAS number, wins over a crop. Compare crops in singular form on both sides (tomatoes to tomato, strawberries to strawberry, apples to apple). A crop answers only when the query names nothing but crops and exactly one pesticide lists that crop; "mancozeb wheat" and "wheat" return null.
    searchAdditives: treat colour/color, flavour/flavor, sulphite/sulfite and sulphur/sulfur as the same word in both query and category; category "banned" means E171, E924a and any additive whose risk level says BANNED.
 4) Create api/_lib/mcp-server.js exporting MCP_PATH ("/api/mcp"), SERVER_INFO ({ name: "nutrisafe-food-mcp", title: "NutriSafe Food Safety MCP (demo dataset)", version: "3.0.0" }), DATASET (the three record counts and the demo sentence below) and async function mcpHandler(req, res):
    First, for every method: if an Origin header is present and its host is neither the request's Host nor the first entry of X-Forwarded-Host, answer 403 with a JSON-RPC error.
    On GET without "text/event-stream" in the Accept header: answer 200 with JSON describing the server: SERVER_INFO, the five tool names, DATASET and how to connect.
    On any other method except POST: answer 405 with an Allow: POST, GET header and {"jsonrpc":"2.0","error":{"code":-32000,"message":"Method not allowed. Send MCP messages with POST."},"id":null}.
    On POST: read req.body inside try, because on Vercel reading it throws when the JSON is malformed; if it throws, answer 400 with code -32700. Then create new McpServer(SERVER_INFO, { instructions: the demo sentence }), register the tools below, create new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true }), await server.connect(transport), then await transport.handleRequest(req, res, body). When res closes, close the transport and the server. Build both fresh on every request; this server keeps no sessions.
 5) Register five tools with server.registerTool. Keep these exact names and inputs, because the screens already call them:
    check_additive { query }, check_ingredient_list { ingredients }, search_additives { query?, category? }, check_nutrition { query }, check_pesticide_mrl { query }.
    Every title ends with "(demo dataset)". Every description is two to four sentences: what comes back, that it is read from the demo dataset bundled with this app, when an agent should use it, and one thing it does not cover.
    Every input is z.string().trim().min(1).max(200) with .describe() saying exactly what it accepts; ingredients allows 4000 characters; search_additives' query (200) and category (100) are optional.
    Every tool has annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }.
    When found, return { content: [{ type: "text", text: JSON.stringify(payload) }], structuredContent: payload }, where payload is { found: true, dataset: "demo", source: "NutriSafe demo dataset bundled with this app", result }.
    When nothing single matches, return { isError: true, content: [{ type: "text", text: one sentence naming the dataset size and what was not found }, { type: "text", text: JSON.stringify(payload) }], structuredContent: payload }, where payload is { found: false, dataset: "demo", source: the same string, message: the same sentence }. search_additives is the exception: an empty list is a valid answer and comes back found: true with result [].
    A tool never returns a stand-in record.
 6) Make api/mcp.js one line: export { mcpHandler as default } from './_lib/mcp-server.js'. In server.ts, add app.use('/api', express.json({ limit: '1mb' })), then app.all(['/api/mcp', '/api'], mcpHandler), importing it rather than copying it, above app.use(vite.middlewares) and above any catch-all route. Add an Express error handler for /api that turns a JSON parse failure into 400 with code -32700 and any other body error into 400 with code -32600, both as JSON-RPC, never as an HTML page. Make api/health.js and the /api/health route in server.ts report MCP_PATH, SERVER_INFO and DATASET. Delete the old proxy code, the workers.dev address everywhere, MCP_SERVER_KEY and the fixed "mcp_latency_ms: 142".
 7) Rewrite src/services/mcpClient.ts as a real MCP client for /api/mcp. It sends initialize with protocolVersion "2025-11-25", then notifications/initialized (the server answers 202 with no body), then tools/call. Every request carries Accept "application/json, text/event-stream", and every request after initialize carries the MCP-Protocol-Version header the server returned. Give every request a 15-second timeout. Export callMcp(tool, args), which resolves to { data, rawPayload, latency } with latency measured in the browser; McpNotFoundError, thrown when the reply has isError with found: false; describeMcpError(err), a sentence for the screen; and useMcpStatus(), a hook built on useSyncExternalStore whose value changes after every call, so the status shows "offline" as soon as a call times out, drops or gets a 5xx.
 8) On every screen: delete each catch block that falls back to bundled data, and show the error or "no match" sentence instead. A view that shows a first result loads it through callMcp when it opens and shows a loading card meanwhile; it never displays a bundled record the server did not return for the current query. The E-Number Directory's first list comes from search_additives. Show only measured latency, with "--" before the first call and while offline. Replace "MCP Connected: JECFA / EFSA / IL-MoH DB Live v4.2", "ISO 17025 Data Verified", "Synchronized codices", the SHA-256 "assay hash", "4,624 foods" and the workers.dev address with the live status from useMcpStatus(), the real dataset counts, and this sentence: "Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources." Relabel "Sync Codices" as "Refresh from MCP" and make it re-run check_additive. The MCP Inspector pop-up shows only real replies from the server. Give the ingredient scanner its own tab; send the "Scan Ingredients Cocktail" suggestion and any search with two or more ", " separators there, but never a chemical name such as "2,4-Hexadienoic Acid", whose commas sit between digits. Send the Glyphosate and Chlorpyrifos suggestions to the Pesticide MRL tab and the hummus suggestion to the Nutrition tab, with the query filled in.
```

---

### Prompt 11: Repository Push With Credentials

```text
git push https://[REDACTED_GH_TOKEN]@github.com/ivyivy-py/food-safety.git
```

