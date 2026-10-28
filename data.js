/* Topics and concept cards for OIT 248 midterm practice.
   Every question in questions.js points at one concept id here. */

const TOPICS = [
  { id: "py-read", name: "Reading Python", area: "py" },
  { id: "py-fix", name: "Finding and fixing bugs", area: "py" },
  { id: "mc-basics", name: "How Monte Carlo works", area: "sim" },
  { id: "mc-flaw", name: "Flaw of averages", area: "sim" },
  { id: "mc-risk", name: "Probabilities, VaR, CVaR", area: "sim" },
  { id: "mc-stages", name: "Modeling in stages", area: "sim" },
  { id: "mc-decide", name: "Comparing decisions", area: "sim" },
  { id: "lp-blocks", name: "Four blocks and decisions", area: "opt" },
  { id: "lp-linear", name: "Linearity and ratios", area: "opt" },
  { id: "lp-status", name: "Binding, slack, status, IIS", area: "opt" },
  { id: "lp-network", name: "Networks and flow balance", area: "opt" },
  { id: "lp-tiers", name: "Tiers, max and min", area: "opt" },
  { id: "lp-gurobi", name: "Reading Gurobi code", area: "opt" },
];

const C = (s) => `<pre class="code">${s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]))}</pre>`;

const CONCEPTS = [
  // ---------------- PYTHON ----------------
  {
    id: "py-structures", area: "py", title: "Lists, dictionaries and DataFrames: how to read one value",
    recall: "Given a list, a dictionary and a DataFrame, how do you read one element from each? What about an entire row?",
    body: `
<p>The exam gives you data in three shapes. You need to read them, not build them.</p>
<table><tr><th>Shape</th><th>Example</th><th>Read one value</th></tr>
<tr><td>List (ordered)</td><td><code>tree_types = ["Maple","Elm","Spruce"]</code></td><td><code>tree_types[0]</code> is "Maple" (0-based), <code>tree_types[-1]</code> is the last</td></tr>
<tr><td>Dictionary (key to value)</td><td><code>plan = {"Maple": 20, "Elm": 20}</code></td><td><code>plan["Elm"]</code> is 20; with pair keys, <code>plan_by_plot["Elm","North"]</code></td></tr>
<tr><td>DataFrame (table)</td><td>rows = tree types, columns = Cost, Water</td><td><code>df.loc["Maple","Cost"]</code> or <code>df["Cost"]["Maple"]</code>; row first with .loc, column first with [ ]</td></tr></table>
<p>Iterating: <code>for c in df.columns</code> walks column names, <code>for r in df.index</code> walks row names. A whole row as a list: <code>[df.loc["Elm", c] for c in df.columns]</code> or <code>list(df.loc["Elm"])</code>.</p>
<p>Slicing a list: <code>line[1:]</code> drops the first item, <code>line[:2]</code> keeps the first two. <code>append(x)</code> adds at the end, <code>pop(0)</code> removes and returns the first.</p>
<p>In a simulation, one row of a DataFrame is one scenario: <code>df["Demand_SS"][s]</code> is the SS demand in scenario s.</p>`
  },
  {
    id: "py-sums", area: "py", title: "Sums over a set, in math and in Python",
    recall: "Write 'total cost = sum over t in T of c_t times n_t' as a for loop and as a one-liner. What changes with two indices?",
    body: `
<p>The same sum, four ways. Reading the one-liner aloud gives the math.</p>
<table><tr><th>Math</th><td>&sum;<sub>t&isin;T</sub> c<sub>t</sub> n<sub>t</sub></td></tr>
<tr><th>Plain text</th><td><code>sum over t in T of c[t] * n[t]</code></td></tr>
<tr><th>Loop with running total</th><td>${C(`total = 0
for t in tree_types:
    total = total + df.loc[t, "Cost"] * plan[t]`)}</td></tr>
<tr><th>One line</th><td><code>sum(df.loc[t, "Cost"] * plan[t] for t in tree_types)</code></td></tr></table>
<p>Classic bug: writing <code>total = df.loc[t,"Cost"] * plan[t]</code> inside the loop (no <code>total +</code>) overwrites instead of accumulating, so you get only the last term.</p>
<p>Two indices: &sum;<sub>t&isin;T</sub>&sum;<sub>p&isin;P</sub> c<sub>t</sub> n<sub>t,p</sub> is <code>sum(c[t]*n[t,p] for t in T for p in P)</code>. A sum "for every p" becomes a for loop over p with one sum inside. Gurobi's <code>quicksum</code> works exactly like <code>sum</code> but adds decisions.</p>`
  },
  {
    id: "py-functions", area: "py", title: "Functions: arguments, defaults, several outputs, calling in a loop",
    recall: "If a function is defined as f(a, b, limit=120), what does f(10, 20) use for limit? How do you call a function once per value of a decision and store the results?",
    body: `
<p>Read a function top to bottom: inputs (arguments), what it computes, what it returns.</p>
<p><b>Default values.</b> <code>def calculate_revenues(Demand_SS, Demand_FF, Booking_Limit_SS=120)</code>. The call <code>calculate_revenues(10, 20)</code> uses the limit 120; <code>calculate_revenues(10, 20, 130)</code> uses 130. Naming an argument lets you change only that one: <code>calculate_gross_profit(Price_Powder=12)</code>.</p>
<p><b>Several outputs.</b> <code>return total_unhoused, remaining_budget</code>. Unpack with <code>a, b = f(...)</code>, or keep the pair and use <code>result[0]</code>, <code>result[1]</code>.</p>
<p><b>Call in a loop over a decision.</b> The pattern the exam loves:</p>
${C(`price_values = np.linspace(8, 15, 71)          # the values to try
profit_values = np.zeros(len(price_values))   # one slot per value

for i, price in enumerate(price_values):
    profit_values[i] = calculate_gross_profit(Price_Powder=price)

best = np.argmax(profit_values)               # position of the largest
print(price_values[best], np.max(profit_values))`)}
<p><code>np.linspace(start, stop, n)</code> gives n evenly spaced values including stop; <code>np.arange(start, stop, step)</code> excludes stop. <code>np.max</code> is the largest value, <code>np.argmax</code> its position (index).</p>`
  },
  {
    id: "py-if-minmax", area: "py", title: "Turning case rules into code: min, max, if",
    recall: "Translate 'roast in house up to capacity, outsource the rest', 'demand is never negative', and 'a fixed cost paid only if anything is outsourced' into one line of Python each.",
    body: `
<p>Most logical errors on the exam are a missing min, max or if. Each sentence of a case is one line.</p>
<table><tr><th>The case says</th><th>The code</th></tr>
<tr><td>Demand is 600M minus 35M times price, never negative</td><td><code>Demand = max(0, Intercept + Slope * Price)</code></td></tr>
<tr><td>Roast in house as much as possible, up to capacity</td><td><code>InHouse = min(Total, Capacity)</code> then <code>Outsourced = Total - InHouse</code></td></tr>
<tr><td>Fixed cost $100M, paid only if something is outsourced</td><td><code>Cost_Fixed = Fixed_Costs if (Outsourced > 0) else 0</code></td></tr>
<tr><td>Sell to full fare only the seats left after super saver</td><td><code>Sales_FF = min(Demand_FF, Capacity - Sales_SS)</code></td></tr>
<tr><td>Rooms limited by availability and by money</td><td><code>min(need, rooms_avail[t], np.floor(budget[t] / rate[t]))</code></td></tr></table>
<p><b>min is the capacity word.</b> "Given = min(still needed, available)." <b>max(0, ...)</b> is the never-negative word. <b>if/elif/else</b> runs the first branch whose condition holds, in order.</p>
<p>Conditions on arrays: <code>(rev >= 75000) & (rev < 100000)</code>, each condition in its own parentheses, <code>&</code> for and, <code>|</code> for or. <code>np.maximum(0, arr)</code> is element-wise (an array back); <code>np.max(arr)</code> is one number.</p>`
  },
  {
    id: "py-tiers", area: "py", title: "Tiered (bracket) prices and costs",
    recall: "A contract charges $2.25 per lb for the first 50M lb, $2.00 for the next 25M, $1.75 beyond. Write the formula for the amount of Q that falls in bracket i and the total cost.",
    body: `
<p>Each unit costs the price of the bracket it falls in. With lower limit L<sub>i</sub>, upper limit U<sub>i</sub> and marginal cost c<sub>i</sub>:</p>
<p><b>Amount in bracket i</b> = min(U<sub>i</sub> &minus; L<sub>i</sub>, max(0, Q &minus; L<sub>i</sub>)). It covers all three cases: Q below the bracket gives 0, Q above gives the whole bracket, Q inside gives Q &minus; L<sub>i</sub>.</p>
<p><b>Total cost</b> = &sum;<sub>i</sub> c<sub>i</sub> &middot; min(U<sub>i</sub> &minus; L<sub>i</sub>, max(0, Q &minus; L<sub>i</sub>)).</p>
${C(`total = 0
for i in df.index:
    Qi = min(df["Upper"][i] - df["Lower"][i], max(0, Q - df["Lower"][i]))
    total += Qi * df["Marginal_Cost"][i]`)}
<p>if/elif/else alternative: <code>if Q <= L: Qi = 0</code>, <code>elif Q <= U: Qi = Q - L</code>, <code>else: Qi = U - L</code>.</p>
<p>Worked check (Marx): 60M lb = 50M &times; 2.25 + 10M &times; 2.00 = $132.5M. 80M lb = 112.5M + 50M + 5M &times; 1.75 = $171.25M. Break complex costs into modules like this rather than one giant formula.</p>`
  },
  {
    id: "py-arrays", area: "py", title: "NumPy summaries: mean, sum, sort, argmax, True/False arrays",
    recall: "Why is np.mean(revenue < 75000) a probability? How do you get the average of the worst 10% of outcomes?",
    body: `
<p>True counts as 1 and False as 0 in arithmetic. So comparing an array with a number gives a True/False array, and:</p>
<ul><li><code>np.sum(rev < 75000)</code> = number of scenarios where the condition holds</li>
<li><code>np.mean(rev < 75000)</code> = fraction of scenarios = the probability</li></ul>
<p>Other summaries: <code>np.mean</code>, <code>np.sum</code>, <code>np.min</code>, <code>np.max</code>, <code>np.sort</code> (ascending), <code>np.argmax</code> / <code>np.argmin</code> (position of the largest / smallest), <code>np.zeros(n)</code> (an array of n zeros to fill in a loop), <code>len(arr)</code>.</p>
<p>Worst decile average (CVaR at 90%):</p>
${C(`ordered = np.sort(revenue_by_sample)     # lowest first
cutoff = int(0.10 * len(ordered))         # how many make up the worst 10%
worst = ordered[:cutoff]                  # those scenarios
VaR_90 = worst[-1]                        # the best of the worst 10%
CVaR_90 = np.mean(worst)                  # their average`)}
<p>pandas equivalents: <code>df["Demand_SS"].mean()</code>, <code>df.mean()</code> for every column.</p>`
  },
  {
    id: "py-random", area: "py", title: "Reading random draws: which distribution, which parameters",
    recall: "What do rng.normal(130, 45, 10000), rng.uniform(0.85, 1.15), rng.triangular(0, 0.5, 2.5) and rng.poisson(20) each assume? How is a coin toss with probability p coded?",
    body: `
<p>You will not write random draws, but you must read them and state the assumptions.</p>
<table><tr><th>Code</th><th>Means</th><th>Used in</th></tr>
<tr><td><code>rng.normal(loc=130, scale=45, size=N)</code></td><td>bell curve, mean 130, standard deviation 45; can go negative, so cases wrap it in <code>np.maximum(0, ...)</code> and <code>.astype(int)</code></td><td>BlueSky demands</td></tr>
<tr><td><code>rng.uniform(low=0.85, high=1.15)</code></td><td>every value between 0.85 and 1.15 equally likely</td><td>Muse hourly noise, Quail demand</td></tr>
<tr><td><code>rng.triangular(left=0, mode=0.5, right=2.5)</code></td><td>smallest 0, most likely 0.5, largest 2.5 (mean = (0+0.5+2.5)/3 = 1)</td><td>Muse launch intensity, Quail snowfall</td></tr>
<tr><td><code>rng.poisson(lam=20)</code></td><td>a count 0,1,2,... with mean 20</td><td>Kirkwood shoppers per hour</td></tr></table>
<p><code>rng = np.random.default_rng(seed=12345)</code> starts the generator; the seed fixes the sequence so a rerun gives the same numbers. <code>size=N</code> gives N draws; <code>size=(n1, n2)</code> gives a table.</p>
<p><b>Coin toss</b> that is 1 with probability p: <code>rng.uniform(0, 1) < p</code>.</p>
<p><b>Independent or correlated?</b> Separate calls to rng are independent. Inputs move together only when the code makes them share a draw (one intensity scaling every hour in Muse), when historical rows carry correlation, or when a joint distribution is sampled.</p>`
  },

  // ---------------- SIMULATION ----------------
  {
    id: "mc-idea", area: "sim", title: "What a Monte Carlo simulation is, in three steps",
    recall: "State the three steps of a Monte Carlo simulation and what one row of the scenario table represents.",
    body: `
<p>A function of nice random inputs (demands, prices) can have an output whose distribution is impossible to compute by hand. So we approximate it by brute force.</p>
<ol><li><b>Generate many scenarios.</b> One row of a DataFrame = one draw from every input distribution (one trial). 10,000 rows is typical.</li>
<li><b>Compute the output in each scenario.</b> Loop over rows, call the model function, store the result in <code>np.zeros(n)</code> or a list.</li>
<li><b>Summarize the outputs.</b> Mean, probabilities, histogram, VaR, CVaR. The 10,000 outputs are an empirical distribution you can ask anything of.</li></ol>
${C(`revenue_by_sample = np.zeros(len(df))
for s in df.index:
    revenue_by_sample[s] = calculate_revenues(Demand_SS=df["Demand_SS"][s],
                                              Demand_FF=df["Demand_FF"][s])
print(np.mean(revenue_by_sample))`)}
<p>Good practice before simulating: plot the output against a key input, and plot histograms of the inputs to check they match the intended distributions (BlueSky: sample mean 130.1 vs intended 130).</p>`
  },
  {
    id: "mc-seed", area: "sim", title: "Seeds and the number of scenarios",
    recall: "Why set a seed? Why do estimates change with the seed and with the number of scenarios?",
    body: `
<p><b>The seed</b> fixes the sequence of random numbers, so the same code run twice gives the same scenarios and the same estimates: replicability, and fair comparisons between decisions on the same scenarios. Change the seed and every estimate moves a little, because the sample is different. Even the order of draws matters: drawing the normal before the triangular gives different numbers than the reverse.</p>
<p><b>The number of scenarios</b> controls how much estimates wobble. More scenarios, less wobble (the sampling error shrinks roughly with the square root of the number of scenarios). Estimates of rare events and tails (a 99.9% VaR) need many more scenarios than the mean does.</p>
<p>Reseeding inside a loop is a bug: every iteration would repeat the same draws.</p>`
  },
  {
    id: "mc-assumptions", area: "sim", title: "Reading a model's assumptions and checking it against the case",
    recall: "What questions do you ask when checking a simulation model against a case description?",
    body: `
<p>The exam gives you a model and asks what it assumes and what it gets wrong. Work through:</p>
<ul><li><b>Which inputs are random?</b> Find every <code>rng.</code> call. Which distribution, what do the parameters mean, is the draw per scenario or per period?</li>
<li><b>Independent or correlated?</b> One shared draw scaling several periods (Muse intensity) creates positive correlation. Separate draws per hour are independent noise.</li>
<li><b>Logical errors:</b> a formula that contradicts the case. Marx: roasting everything in house ignores the 200M lb capacity (needs <code>min</code>); charging the fixed cost whenever anything is roasted (should be only if outsourced). BlueSky: <code>min(Demand_FF, Capacity - Booking_Limit)</code> leaves seats empty when SS demand is below the limit (should be <code>Capacity - Sales_SS</code>). Muse: forgetting that the backlog is also waiting (<code>waiting = backlog + arrivals[hour]</code>).</li>
<li><b>Business omissions:</b> a case requirement the model leaves out. Muse: traffic that never came because the retailer blocked it was not counted as lost.</li>
<li><b>Assumptions where the case is vague:</b> e.g. all demand is sold, sales happen in a fixed order, the model does not depend on price. Say them out loud.</li>
<li><b>Robustness:</b> would the logic still work if an input changed (a different price, a huge demand)? Think adversarially.</li></ul>`
  },
  {
    id: "mc-flaw", area: "sim", title: "The flaw of averages and Jensen's inequality",
    recall: "Why is revenue at average demand not the average revenue? Which direction is the error for a concave function like capped revenue?",
    body: `
<p>Plugging the average inputs into the model does not give the average output. BlueSky: revenue at mean demands (130, 80) is $110,000, but the mean revenue over 10,000 departures is $98,727.</p>
<p><b>Why:</b> the revenue function is capped by the <code>min</code> with seats available. A high-demand departure cannot make up for a low-demand one, so the average of the capped outputs sits below the output at the average.</p>
<p><b>Jensen's inequality:</b> for a concave f (profits, revenues with capacity caps), f(mean X) &ge; mean f(X): using the means <b>overestimates</b>, a rosy picture. For a convex f (taxes, penalties, overage costs), f(mean X) &le; mean f(X): using the means <b>underestimates</b>.</p>
<p>Lesson: be wary when someone asks for "just one number". Model the uncertainty.</p>`
  },
  {
    id: "mc-risk", area: "sim", title: "Summaries of the output: mean, probability, VaR, CVaR",
    recall: "Define VaR and CVaR at level alpha. Which one captures the severity of the bad tail and which only its location?",
    body: `
<p>From the 10,000 outputs you can compute:</p>
<ul><li><b>Mean:</b> <code>np.mean(rev)</code>. The expected outcome.</li>
<li><b>Probability of an event:</b> the fraction of scenarios where it happens, <code>np.mean(rev < 75000)</code>.</li>
<li><b>Value at Risk (VaR) at level &alpha;</b> (95%, 99%, 99.9%): the &alpha; percentile of the loss distribution, where the (1&minus;&alpha;) bad tail begins. For revenues, the worst-decile VaR is the best value among the worst 10% (BlueSky: $72,600).</li>
<li><b>Conditional Value at Risk (CVaR), a.k.a. expected shortfall:</b> the average of the outcomes in that bad tail. BlueSky worst-decile average: $60,263.</li></ul>
<p><b>What each says.</b> VaR tells you where the tail starts (frequency); it ignores how bad things get inside the tail. CVaR averages the tail, so it reacts to severity too. Muse: making the retailer block more damaging left the mean and the VaR unchanged but raised CVaR 15%; making blocking 10&times; more likely raised VaR 76% and CVaR 56%, with the mean almost unchanged.</p>
<p>The mean can hide everything that matters about risk.</p>`
  },
  {
    id: "mc-stages", area: "sim", title: "Modeling in stages: what carries over, what is lost",
    recall: "For a model with ordered stages (periods, customer classes, capacity types), what two questions do you ask of every quantity and every limit?",
    body: `
<p>A stage can be a time period, a step of operations, a customer class or a type of capacity, taken in a fixed order. For every quantity ask: does it carry over to the next stage or is it lost? For every limit: does it reset or is it used up by what came before?</p>
<table><tr><th>Case</th><th>Stages</th><th>Carries over</th><th>Lost</th></tr>
<tr><td>Marx</td><td>roast in house, then outsource</td><td>beans beyond capacity go to outsourcing</td><td>unused in-house capacity</td></tr>
<tr><td>Marx Q4</td><td>contract brackets filled in order</td><td>quantity above the bracket</td><td>nothing</td></tr>
<tr><td>BlueSky</td><td>SS demand, then FF demand</td><td>seats not sold to SS</td><td>SS demand beyond the limit; FF demand beyond the plane; empty seats</td></tr>
<tr><td>Giga-Tech (A1)</td><td>weeks: receive, assemble, ship</td><td>inventory of modules and towers</td><td>unused supplier capacity, cancelled orders</td></tr>
<tr><td>Muse</td><td>hours</td><td>backlog of requests, less those who quit</td><td>unused compute, demand that quits</td></tr>
<tr><td>DHA (2025 exam)</td><td>months: THUs, then hotels</td><td>everyone still in the system; remaining budget</td><td>unhoused that month</td></tr></table>
<p><b>Writing one stage:</b> given = min(still needed, available); still needed &minus; given goes to the next stage; available &minus; given carries over or is lost; after the last stage, what is still needed is unserved.</p>
${C(`# Muse, one hour
waiting = backlog + arrivals[hour]
served  = min(waiting, capacity)
backlog = waiting - served`)}`
  },
  {
    id: "mc-decisions", area: "sim", title: "Comparing decisions under uncertainty",
    recall: "How do you find the booking limit that maximizes mean revenue, and why might a risk measure recommend a different limit?",
    body: `
<p>Test every candidate decision on the <b>same scenarios</b>, so decisions differ only because of the decision, not the luck of the draw.</p>
${C(`booking_limit_values = np.linspace(0, Capacity, Capacity + 1)
mean_revenue_values = np.zeros(len(booking_limit_values))

for i, book_limit in enumerate(booking_limit_values):
    revenue_by_sample = [calculate_revenues(df["Demand_SS"][s], df["Demand_FF"][s],
                                            Booking_Limit_SS=book_limit) for s in df.index]
    mean_revenue_values[i] = np.mean(revenue_by_sample)

best_limit = booking_limit_values[np.argmax(mean_revenue_values)]`)}
<p>BlueSky: mean revenue is maximized at a limit of 113 (close to the current 120), but the worst-decile average is maximized at 186. The two cannot be reconciled by the model; the recommendation depends on <b>risk preferences</b>. A constrained version: choose the decision that maximizes the mean subject to a risk measure staying above a threshold (Muse Q3: capacity with a limit on risk; 2025 exam Q3: minimize mean unhoused subject to mean remaining budget &ge; 500,000, with an <code>if</code> that keeps the best feasible option and reports "no option is feasible" when none passes).</p>`
  },

  // ---------------- OPTIMIZATION ----------------
  {
    id: "lp-blocks", area: "opt", title: "The four blocks: data, decisions, objective, constraints",
    recall: "What goes in each of the four blocks? How do you write a family of constraints?",
    body: `
<ol><li><b>Data:</b> the sets (T = tree types, indexed by t) and the known numbers, each with a symbol (c<sub>t</sub> cost of a seedling of type t; L land available). On the exam the symbols are defined for you.</li>
<li><b>Decisions:</b> one decision for every element of a set, with meaning, units and bounds: x<sub>t</sub> &ge; 0 = number of seedlings of type t planted, for every t &isin; T.</li>
<li><b>Objective:</b> minimize or maximize, written as a sum: minimize &sum;<sub>t&isin;T</sub> c<sub>t</sub> x<sub>t</sub>.</li>
<li><b>Constraints:</b> every requirement of the case, each with its sense and right-hand side. A family: x<sub>t</sub> &le; a<sub>t</sub> <b>for every</b> t &isin; T. Always include non-negativity.</li></ol>
<p>Oro Verde in summation form: min &sum; c<sub>t</sub>x<sub>t</sub> s.t. &sum; &ell;<sub>t</sub>x<sub>t</sub> &le; L (land), &sum; w<sub>t</sub>x<sub>t</sub> &le; W (water), x<sub>t</sub> &le; a<sub>t</sub> for every t, x<sub>Elm</sub> &ge; E, &sum; p<sub>t</sub>s<sub>t</sub>x<sub>t</sub> &ge; C (sequestration), x<sub>t</sub> &ge; 0.</p>
<p>Best practice: put a data number on the right-hand side; if impossible, move everything left and leave 0. Pseudocode is fine: <code>minimize sum over t in T of c[t] * x[t]</code>. Add one comment per constraint saying what it enforces.</p>
<p>Grading in 2025 (Scroogle Q1, 25 pts): decisions 5, objective 4, each constraint family 5, non-negativity 1. Write every family and its quantifier.</p>`
  },
  {
    id: "lp-decisions", area: "opt", title: "Choosing decisions: lists, pairs and tables",
    recall: "When do you need a decision for every pair (two indices)? Give three cases from the course.",
    body: `
<p>Look at how the data is presented and what the template defines.</p>
<ul><li><b>Data in a list</b> (one number per food, per tree type): one decision per element. Diet: q<sub>f</sub> amount of food f.</li>
<li><b>Data in a table</b> (product &times; material, factory &times; center, region &times; datacenter, user &times; advertiser): one decision per pair. Lululime q<sub>p,m</sub>, Prosche x<sub>f,c</sub> and y<sub>c,r</sub>, Scroogle x<sub>r,d</sub>.</li></ul>
<p>More decisions is fine as long as the count does not explode; more decisions make expressions easier to write. The test of a good choice: can you write every ingredient of the model, linearly, as sums of (coefficient &times; decision)?</p>
<p>Several choices can work. Lululime: share of product weight q<sub>p,m</sub>, or kg per item z<sub>p,m</sub> = q<sub>p,m</sub>W<sub>p</sub>, or total kg y<sub>p,m</sub> = q<sub>p,m</sub>W<sub>p</sub>D<sub>p</sub>. Scroogle: QPS routed x<sub>r,d</sub> or fraction routed f<sub>r,d</sub>. All give the same optimum if used consistently.</p>
<p>Typical terms: objective = (amount) &times; (price or cost per unit); constraint = (amount) &times; (resource per unit) &le; available. Write the decision's units explicitly (100 g units in the Diet case) and keep the data consistent with them.</p>`
  },
  {
    id: "lp-linear", area: "opt", title: "Is it linear? Products of data are fine, products of decisions are not",
    recall: "List the expressions that are not linear in the decisions. Is p_t s_t x_t linear? Is x_1 / x_2?",
    body: `
<p>Every expression (objective, both sides of every constraint) must be of the form &#9675;&middot;x<sub>1</sub> + &#9675;&middot;x<sub>2</sub> + ... + &#9675;, where x are decisions and the &#9675; coefficients depend only on data.</p>
<p><b>Linear:</b> 0.7 &times; 4.3 &times; x<sub>Maple</sub> (two data items times a decision), x<sub>t</sub> / 100 (dividing by data), D<sub>p</sub>W<sub>p</sub>q<sub>p,m</sub>, AE / 70.</p>
<p><b>Not linear:</b> x &times; y (two decisions multiplied, e.g. price &times; quantity when both are chosen; S<sub>p</sub> &times; q<sub>p,m</sub>), x / y, x<sup>2</sup>, &radic;x, log, exp, |x|, max(x, 5), min(x, y), IF(x > 5, ...).</p>
<p><b>Never</b> apply IF, MIN, MAX, ABS or a ratio to decisions in a linear model. Several of these can be rewritten (ratios, max in &le; constraints, piecewise linear objectives); see the other cards. Whether a model is linear can depend on the choice of decisions: switching from (production, share) to total kg y<sub>p,m</sub> made Lululime Q5 linear again.</p>`
  },
  {
    id: "lp-ratio", area: "opt", title: "Ratio constraints: multiply out the denominator",
    recall: "Write 'at least 45% of all polyester is recycled' first as a ratio, then linearly. What sign condition makes the rewrite valid?",
    body: `
<p>"At least 20% of the planted trees should be maples": M / (M + E + S) &ge; 0.2 has decisions in the denominator, so it is nonlinear. Because the denominator is non-negative, multiplying through keeps the inequality:</p>
<p style="text-align:center">M &ge; 0.2 (M + E + S) &nbsp; or &nbsp; M &minus; 0.2 (M + E + S) &ge; 0</p>
<p><b>General rule (handout &sect;4.1):</b> f(x)/g(x) &ge; L becomes f(x) &ge; L&middot;g(x) when g(x) &ge; 0 for every feasible x; the direction flips if g(x) &le; 0.</p>
<p>Lululime polyester pledge: &sum;<sub>p</sub> D<sub>p</sub>W<sub>p</sub>q<sub>p,Rec</sub> &ge; 0.45 (&sum;<sub>p</sub> D<sub>p</sub>W<sub>p</sub>q<sub>p,Rec</sub> + &sum;<sub>p</sub> D<sub>p</sub>W<sub>p</sub>q<sub>p,Vir</sub>).</p>
<p>Scroogle average latency: &sum;<sub>d</sub> Latency<sub>r,d</sub>x<sub>r,d</sub> &le; 100 &sum;<sub>d</sub> x<sub>r,d</sub> for every region r.</p>
<p>Gasoline blending octane: &sum;<sub>c</sub> Octane<sub>c</sub>X<sub>p,c</sub> &ge; MinOctane<sub>p</sub> &sum;<sub>c</sub> X<sub>p,c</sub> for every product p. In Gurobi, dividing two expressions is not allowed; write <code>lhs >= 0.45 * rhs</code>.</p>`
  },
  {
    id: "lp-status", area: "opt", title: "Feasible, infeasible, optimal, unbounded; binding and slack",
    recall: "Define binding constraint. In Gurobi, what sign does the slack of a non-binding >= constraint have, and why?",
    body: `
<p><b>Feasible solution:</b> satisfies every constraint. <b>Optimal:</b> the best objective among feasible solutions. <b>Infeasible problem:</b> no feasible solution exists (Gurobi status INFEASIBLE). <b>Unbounded:</b> the objective can be pushed without limit, which in a real problem means a constraint is missing (status UNBOUNDED or INF_OR_UNBD; set <code>DualReductions = 0</code> to tell which).</p>
<p><b>Binding (tight) constraint:</b> LHS = RHS at the optimal solution. These are the constraints that matter; relaxing them would change the solution. Non-binding constraints have wiggle room.</p>
<p><b>Slack in Gurobi</b> = RHS &minus; LHS at the solution (<code>con.Slack</code>). So: binding gives 0; a non-binding &le; gives positive slack (unused capacity); a non-binding &ge; gives <b>negative</b> slack (overshoot). Equalities always show 0. Other software reports the absolute value.</p>
<p>Reading a status table (Diet): protein slack &minus;61.7 means the diet has 61.7 g more than the 56 g minimum; seven minimums were binding (energy, fiber, vitamin C, K, niacin, choline, magnesium). Lululime: recycled polyester supply and both pledges binding; that single scarce input forced cotton into products that did not need it.</p>
<p>A causal chain: one binding constraint changes decisions, which makes other constraints bind. Gurobi does <b>not</b> report whether the optimum is unique.</p>`
  },
  {
    id: "lp-multi", area: "opt", title: "Many optimal plans: what it means and how to detect it",
    recall: "Describe the procedure to check whether an LP has multiple optimal solutions.",
    body: `
<p>Several different decisions can give the same optimal objective (Lululime: organic cotton costs the same in whichever cotton product it goes, so it can be moved around). Gurobi returns one of them without saying so.</p>
<p><b>Detection recipe:</b></p>
<ol><li>Solve once; record the optimal objective <code>best</code>.</li>
<li>Add the constraint <code>profit >= best</code> (or &le; for a minimization). Now every feasible point is optimal for the original.</li>
<li>For every decision v: minimize v, record v.X; maximize v, record v.X.</li>
<li>If largest &minus; smallest &gt; 0 for any decision, there are multiple optimal plans; the range shows how far that decision can move without changing the objective.</li>
<li>Remove the extra constraint and restore the objective.</li></ol>
<p>Two solves per decision. Management can then pick among optimal plans using a second criterion (simplicity, marketing).</p>`
  },
  {
    id: "lp-iis", area: "opt", title: "Infeasible models and the IIS",
    recall: "What is an IIS? Does removing one constraint from it make the model feasible? Who decides what to relax?",
    body: `
<p>When Gurobi reports INFEASIBLE, first check the model (a &ge; typed as &le;), then the data (units: micrograms vs milligrams; an upper limit below a lower limit), then accept it may be genuinely infeasible.</p>
<p><b>IIS (irreducible infeasible subsystem):</b> a small set of constraints that cannot all hold together, but any proper subset can. <code>model.computeIIS()</code> then <code>con.IISConstr</code> flags members.</p>
<ul><li>A model can have several IISs; computeIIS gives one. Removing one constraint from it fixes that conflict only; re-solve and compute a new IIS if still infeasible (Diet: dropping fiber gave a new 7-constraint IIS; only dropping the budget restored feasibility).</li>
<li>The IIS does not say which constraint is "wrong", and can contain constraints that look unrelated (the recycled polyester pledge appears in the organic cotton infeasibility, because capping polyester forces more cotton and therefore more organic cotton than exists).</li>
<li>Prefer relaxing to removing (23.6% organic instead of 25%). <b>The way out is a management choice</b>: which requirement to loosen.</li></ul>
<p>Lululime chain: 7.80M kg fiber needed; polyester at most 1.6/0.45 = 3.56M; cotton at least 4.24M; organic at least 0.25 &times; 4.24 = 1.06M &gt; 1.0M supply.</p>`
  },
  {
    id: "lp-network", area: "opt", title: "Network models: decisions on arcs and flow balance at every pass-through node",
    recall: "Write the flow conservation constraint at a customization center that receives from factories and ships to retailers. Which other constraints does a supply chain network need?",
    body: `
<p>Prosche: factories F ship to customization centers C, which ship to retail clients R. Cost data is given per arc, so decisions live on arcs:</p>
<ul><li>x<sub>f,c</sub> &ge; 0 units shipped from factory f to center c; y<sub>c,r</sub> &ge; 0 units from center c to retailer r.</li></ul>
<p><b>Objective:</b> maximize &sum;<sub>c,r</sub> Price<sub>r</sub> y<sub>c,r</sub> &minus; &sum;<sub>f,c</sub> (UnitCost<sub>f</sub> + Transport<sub>f,c</sub> + Staff<sub>c</sub>) x<sub>f,c</sub> &minus; &sum;<sub>c,r</sub> Transport<sub>c,r</sub> y<sub>c,r</sub>.</p>
<p><b>Constraints:</b></p>
<ul><li>Factory capacity: &sum;<sub>c</sub> x<sub>f,c</sub> &le; Capacity<sub>f</sub> for every f.</li>
<li>Center capacity: &sum;<sub>f</sub> x<sub>f,c</sub> &le; Capacity<sub>c</sub> for every c (or on outflow; equivalent given balance).</li>
<li><b>Flow balance at every pass-through node:</b> &sum;<sub>f</sub> x<sub>f,c</sub> = &sum;<sub>r</sub> y<sub>c,r</sub> for every c. General form: inflow + supply = outflow + demand.</li>
<li>Do not exceed pre-orders: &sum;<sub>c</sub> y<sub>c,r</sub> &le; Preorder<sub>r</sub> for every r.</li>
<li>Non-negativity.</li></ul>
<p>Alternative: one decision per full path s<sub>f,c,r</sub>; then balance holds automatically but the model is larger. Use paths when demand or price is given per path (BlueSky Airlines itineraries). Chatbot mistake to check for in Prosche Q2: a model that counts a cost on the wrong index or omits balance.</p>
<p>A KPI trade-off (Prosche Q3): add "fill rate at every retailer &ge; F" as a constraint and re-solve for several F to trace a trade-off curve.</p>`
  },
  {
    id: "lp-tiers", area: "opt", title: "Tiered prices and piecewise-linear objectives with one decision per tier",
    recall: "SH pays 72,000 for each of the first 1,600 cars and 69,000 beyond. Model the revenue linearly. When does this trick fail?",
    body: `
<p>Revenue is concave piecewise linear in the quantity: slopes decrease (72,000 then 69,000). To maximize it linearly:</p>
<ol><li>Add one decision per segment: s<sub>high</sub> (cars at 72,000), s<sub>low</sub> (cars at 69,000), both &ge; 0.</li>
<li>Revenue = 72,000 s<sub>high</sub> + 69,000 s<sub>low</sub>.</li>
<li>Link: s<sub>high</sub> + s<sub>low</sub> = &sum;<sub>c</sub> y<sub>c,SH</sub> (total shipped to SH); s<sub>high</sub> &le; 1,600; s<sub>low</sub> &le; 400 (optional if the 2,000 pre-order cap is kept).</li></ol>
<p><b>Why it works:</b> a maximizer greedily fills the 72,000 tier first, so the split comes out right on its own.</p>
<p><b>When it fails:</b> if the later tier were better (convex revenue, e.g. a bonus rate beyond 1,600), the optimizer would fill the high tier first and cheat. The trick only works for <b>maximizing concave</b> or <b>minimizing convex</b> piecewise-linear functions. Minimizing a cost with increasing marginal cost (2025 Scroogle Q2: 10,000 QPS lost per model for the first 10, 20,000 beyond) uses the same trick: l<sub>d</sub> &le; 10, capacity minus (10 l<sub>d</sub> + 20 h<sub>d</sub>).</p>
<p>A volume discount in a cost you minimize (cheaper beyond 300) is concave; the trick fails and you would need gp.min_ with binaries.</p>`
  },
  {
    id: "lp-minmax", area: "opt", title: "Max and min: in constraints, and minimizing a maximum",
    recall: "How do you minimize the largest average latency across regions with a linear model? How do you write max(M, E, S) <= 30?",
    body: `
<p><b>In constraints (handout &sect;4.2):</b> max(f<sub>1</sub>, ..., f<sub>m</sub>) &le; K is the same as f<sub>i</sub> &le; K for every i. min(f<sub>1</sub>, ..., f<sub>m</sub>) &ge; K is f<sub>i</sub> &ge; K for every i. The opposite directions (max &ge; K, min &le; K) cannot be done with continuous decisions.</p>
<p><b>Minimizing a maximum (&sect;4.4):</b> add one decision M, minimize M, and add M &ge; f<sub>i</sub>(x) for every i. The optimizer pushes M down onto the largest f<sub>i</sub>. 2025 Scroogle Q3: minimize M s.t. M &ge; &sum;<sub>d</sub> Latency<sub>r,d</sub>x<sub>r,d</sub> / Traffic<sub>r</sub> for every region r (dividing by data is fine; dividing by &sum;<sub>d</sub>x<sub>r,d</sub> would not be).</p>
<p><b>Maximizing a minimum:</b> maximize R with R &le; f<sub>i</sub>(x) for every i (Prosche: maximize the smallest fill rate; a risk-averse planner maximizing the worst-scenario profit).</p>
<p>Both are special cases of the same fact: a concave piecewise-linear function is the min of linear pieces (maximize it), a convex one is the max of linear pieces (minimize it).</p>`
  },
  {
    id: "lp-gurobi", area: "opt", title: "Reading and fixing a Gurobi model",
    recall: "Map each of the four blocks to a Gurobi call. What are the five most common bugs in a snippet?",
    body: `
<table><tr><th>Model</th><th>Gurobi</th></tr>
<tr><td>new model</td><td><code>model = gp.Model("name")</code></td></tr>
<tr><td>decision for every element of a list</td><td><code>x = model.addVars(tree_types, lb=0, name="x")</code>, then <code>x[t]</code></td></tr>
<tr><td>decision for every pair</td><td><code>y = model.addVars(list_1, list_2, lb=0, name="y")</code>, then <code>y[i, j]</code></td></tr>
<tr><td>one unindexed decision</td><td><code>M = model.addVar(lb=0, name="M")</code></td></tr>
<tr><td>a sum with decisions</td><td><code>gp.quicksum(c[t] * x[t] for t in tree_types)</code></td></tr>
<tr><td>objective</td><td><code>model.setObjective(expr, gp.GRB.MINIMIZE)</code> or <code>MAXIMIZE</code></td></tr>
<tr><td>one constraint</td><td><code>model.addConstr(lhs <= rhs, name="water")</code>; also <code>>=</code>, <code>==</code></td></tr>
<tr><td>"for every t in T"</td><td><code>for t in tree_types: model.addConstr(...)</code></td></tr>
<tr><td>solve, read</td><td><code>model.optimize()</code>; <code>model.Status == gp.GRB.OPTIMAL</code>; <code>model.ObjVal</code>; <code>x[t].X</code>; <code>con.Slack</code></td></tr>
<tr><td>infeasible</td><td><code>model.computeIIS()</code>; <code>con.IISConstr</code></td></tr></table>
<p><b>Bugs to hunt for:</b> wrong sense (&ge; typed as &le;), MINIMIZE on a profit, <code>sum</code> instead of <code>quicksum</code> with decisions, summing over the wrong list or index, <code>addVars</code> with one list when the decision needs two, a constraint added once instead of inside a for loop (or the loop variable not used), using <code>=</code> instead of <code>==</code>, a ratio with decisions in the denominator, multiplying two decisions, reading <code>.X</code> before <code>optimize()</code>, a missing non-negativity bound (<code>lb=0</code> is the default, so this is rarely the bug).</p>`
  },
];
