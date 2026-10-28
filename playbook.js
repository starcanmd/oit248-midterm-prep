/* Exam code playbook: the question types the midterm is expected to ask, with the code to write for each.
   Built from the 2026 study guide, the 2025 exam and solutions, and the in-scope cases. */

const EXPECT = `
<p><b>Problem 1, linear optimization (50 points).</b> Q1 asks for a full model in four blocks (data, decisions, objective, constraints) written in markdown with math, pseudocode or precise words; the template defines the data symbols. Follow-up questions add a twist you have seen in a case: a ratio requirement (Lululime pledges, Scroogle average latency), a tiered price or cost (Prosche SH contract, 2025 AI-model capacity loss), a new KPI as a constraint (Prosche fill rate), or a min-max objective (2025 largest regional latency). One question gives a very small Gurobi snippet to fix, run and interpret (status, binding constraints).</p>
<p><b>Problem 2, simulation (50 points).</b> Q1 gives a Python function with missing lines (marked <code>...</code>) or wrong logic, in the shape of a stage loop (DHA months, Muse hours, Giga-Tech weeks, BlueSky fare classes); you complete or fix it and explain the assumptions. Q2 asks you to write a function that runs the Q1 model over many scenarios (historical rows or drawn values) and returns means or other summaries; it includes test cases. Q3 asks you to use that function to choose a decision, usually with a loop over candidate values and a constraint on a risk measure or budget, reporting when no option is feasible. Expect sub-questions on a probability, a VaR or CVaR, the flaw of averages, and the effect of a seed or sample size.</p>
<p>In 2025 Problem 1 was Scroogle routing (model, then convex tiers, then min-max) and Problem 2 was DHA housing (fill in the month loop, average over 10 historical years, choose the number of units under a budget floor). The 2026 study guide lists the same skills, so the templates below are the code to have in your hands.</p>`;

const PLAYBOOK = [
  {
    id: "pb1", area: "sim", title: "P2 Q1: fill in or fix a stage loop",
    when: "A function steps through months, hours or weeks with lines marked ... or with a bug. Expected every year.",
    concept: "mc-stages",
    code: `# DHA (2025): THUs first, then hotels limited by rooms AND money, then unhoused; budget falls by rooms paid
for t in range(12):
    ref_in_need_t = new_arrivals[t] + ref_THU[t] + ref_hotel[t] + ref_unhoused[t]   # everyone needs a place
    ref_THU[t+1] = min(ref_in_need_t, THU_cap)                                        # given = min(needed, available)
    ref_in_need_hotel_t = ref_in_need_t - ref_THU[t+1]                                # what is still needed passes on
    ref_hotel[t+1] = min(ref_in_need_hotel_t, hotel_rooms_avail[t], np.floor(budget_avail[t] / room_rates[t]))
    ref_unhoused[t+1] = ref_in_need_hotel_t - ref_hotel[t+1]                          # unserved after the last stage
    budget_avail[t+1] = budget_avail[t] - ref_hotel[t+1] * room_rates[t]
total_unhoused = np.sum(ref_unhoused)
remaining_budget = budget_avail[12]

# Muse (hours): the queue carries over, capacity does not
waiting = backlog + arrivals[hour]      # NOT just arrivals[hour]
served = min(waiting, capacity)
backlog = waiting - served
total_delay = total_delay + backlog
quitters = round(backlog * quit_rate)
gave_up = gave_up + quitters
backlog = backlog - quitters
lost = gave_up + never_came             # count the users who never came

# Giga-Tech (weeks): lead time, assemble, ship, carry
received_A = [0 if t == 0 else orders_A[t-1] for t in weeks]
assembled[t] = min(A_parts, B_parts)                      # as many as parts allow, regardless of demand
orders_filled[t] = min(weekly_orders[t], avail_GT + assembled[t])
avail_GT = avail_GT + assembled[t] - orders_filled[t]     # unsold towers carry over

# BlueSky (fare classes): the second class gets what the first left
Sales_SS = min(Demand_SS, Booking_Limit_SS)
Sales_FF = min(Demand_FF, Capacity - Sales_SS)            # NOT Capacity - Booking_Limit_SS

# Marx (capacity then overflow, fixed cost only when triggered)
InHouse = min(Total, Capacity); Outsourced = Total - InHouse
Cost_Fixed = Fixed_Costs if (Outsourced > 0) else 0
Demand = max(0, Intercept + Slope * Price)`,
    notes: "Write one comment per line saying which sentence of the case it implements. Use np.floor when the problem says to round down to whole units."
  },
  {
    id: "pb2", area: "sim", title: "P2 Q2: run the model over scenarios and return means",
    when: "Given the one-scenario function and either historical rows (DataFrames with one row per year, one column per period) or random draws. Includes test cases.",
    concept: "mc-idea",
    code: `# A. historical rows as equally likely scenarios (2025 Q2)
def calculate_mean_values(new_THU_built):
    num_years = len(arrivals_df)
    months = list(arrivals_df.columns)
    unhoused_by_year = np.zeros(num_years)
    budget_by_year = np.zeros(num_years)
    for y in range(num_years):
        arrivals_y = [arrivals_df[m][y] for m in months]      # column m, row y
        rooms_y = [rooms_df[m][y] for m in months]
        rates_y = [rates_df[m][y] for m in months]
        unhoused_by_year[y], budget_by_year[y] = run_simulation_one_year(
            new_arrivals=arrivals_y, hotel_rooms_avail=rooms_y,
            room_rates=rates_y, new_THU_built=new_THU_built)
    return np.mean(unhoused_by_year), np.mean(budget_by_year)

# B. scenarios drawn inside the function (Quail): same seed every call, so every decision sees the same seasons
def simulate_profit(price, n_trials=10_000, seed=2026):
    rng = np.random.default_rng(seed)
    profit = np.zeros(n_trials)
    for t in range(n_trials):
        snowfall = rng.triangular(120, 175, 200)
        demand = rng.uniform(5_500 * snowfall - 6_000 * price, 6_200 * snowfall - 6_000 * price)
        served = min(demand, CAPACITY)
        cost = rng.uniform(COST_LOW[tier], COST_HIGH[tier])   # tier chosen from demand (see tiers)
        profit[t] = price * served - cost
    return profit

# C. scenarios already in a DataFrame (BlueSky, Giga-Tech)
revenue_by_sample = np.zeros(len(df))
for s in df.index:
    revenue_by_sample[s] = calculate_revenues(df["Demand_SS"][s], df["Demand_FF"][s])
# Giga-Tech: one row per scenario, one column per week
scenario_demands = np.array(df_scenarios)
for s in range(len(df_scenarios)):
    scenario_profits[s] = calculate_profit_scenario(FRAC_A, FRAC_B, scenario_demands[s])`,
    notes: "Build each scenario's inputs as plain lists, call the given function by keyword, store every output you will need later (demands too, if a later question asks about turned-away customers)."
  },
  {
    id: "pb3", area: "sim", title: "P2 Q3: choose the decision with a loop (and a constraint)",
    when: "Use the Q2 function to find the best decision value. Often with a floor or cap on a second KPI, and a request to detect infeasibility.",
    concept: "mc-decisions",
    code: `# constrained search with an infeasibility flag (2025 Q3: minimize mean unhoused, mean budget >= 500,000)
THU_values = np.arange(0, budget / THU_cost, 10)       # multiples of 10
optimal_unhoused = np.inf                              # nothing found yet (use -np.inf when maximizing)
for n in THU_values:
    mean_unhoused, mean_budget = calculate_mean_values(new_THU_built=n)
    if (mean_budget >= 500_000) and (mean_unhoused < optimal_unhoused):
        optimal_THU = n
        optimal_unhoused = mean_unhoused
        optimal_budget = mean_budget
if optimal_unhoused < np.inf:
    print(f"Build {optimal_THU:.0f} THUs: mean unhoused {optimal_unhoused:,.1f}, budget {optimal_budget:,.0f}")
else:
    print("No option is feasible.")

# unconstrained sweep with argmax (BlueSky limit, Marx price, Quail price)
grid = np.arange(0, 201)                               # or np.linspace(8, 15, 71)
mean_vals = np.zeros(len(grid))
for i, d in enumerate(grid):
    outputs = np.zeros(len(ss))
    for s in range(len(ss)):
        outputs[s] = calculate_revenues(ss[s], ff[s], d)   # SAME scenarios for every d
    mean_vals[i] = np.mean(outputs)
best = grid[np.argmax(mean_vals)]                      # map the position back to the decision

# two criteria at once (mean and a tail measure)
tail_vals = np.zeros(len(grid))
# inside the loop: o = np.sort(outputs); tail_vals[i] = np.mean(o[:int(0.1 * len(o))])
# then compare grid[np.argmax(mean_vals)] with grid[np.argmax(tail_vals)] and state the risk preference`,
    notes: "Say in one sentence which risk preference your recommendation assumes, and note that the curve is usually flat near the peak."
  },
  {
    id: "pb4", area: "sim", title: "P2 sub-questions: probability, VaR, CVaR, flaw of averages",
    when: "Asked after Q2 in most cases (BlueSky Q3, Muse Q2, Quail Q2).",
    concept: "mc-risk",
    code: `# probability of an event = mean of a True/False array
prob_below = np.mean(revenue_by_sample < 75_000)
prob_between = np.mean((revenue_by_sample >= 75_000) & (revenue_by_sample < 100_000))
count = np.sum(revenue_by_sample < 75_000)

# VaR and CVaR for a REVENUE or PROFIT (low is bad): tail at the bottom
ordered = np.sort(profit)
cutoff = int(0.05 * len(ordered))         # worst 5%
worst = ordered[:cutoff]
var_95 = worst[-1]                        # or worst[cutoff - 1]
cvar_95 = np.mean(worst)

# VaR and CVaR for a LOSS or COST (high is bad): tail at the top
ordered = np.sort(lost)
cutoff = int(0.001 * len(ordered))        # worst 0.1%
worst = ordered[-cutoff:]
var = worst[0]
cvar = np.mean(worst)

# a quantity not returned by the function, rebuilt from stored inputs (Quail turned-away customers)
turned_away = np.maximum(demands - CAPACITY, 0)
print(np.mean(turned_away >= 50_000))

# flaw of averages: output at the mean inputs vs mean of the outputs
print(calculate_revenues(Mean_SS, Mean_FF), np.mean(revenue_by_sample))   # 110,000 vs 98,727
# explanation to write: the min() caps the upside, the downside is real, so the average of outputs is lower
# (Jensen: concave output -> plugging in means overestimates; convex cost -> underestimates)`,
    notes: "Decide first whether high or low is bad, then pick the end of the sorted array."
  },
  {
    id: "pb5", area: "sim", title: "P2 extension: add a rare shock or a new rule with an if",
    when: "Quail Q4 style: a 1% closure, a retailer block, a new policy that depends on the state.",
    concept: "py-random",
    code: `CLOSURE_CHANCE = 0.01
SHARE_KEPT = 0.20
closures = 0
for t in range(n_trials):
    ...                                                  # existing draws
    closed = rng.uniform(0, 1) < CLOSURE_CHANCE          # coin toss, True with probability 0.01
    served = min(demand, CAPACITY)
    profit_no_closure[t] = price * served - cost
    if closed:
        served = SHARE_KEPT * served                     # only 20% of customers served
        closures = closures + 1
    profit_closure[t] = price * served - cost            # cost unchanged: committed in advance
# compare mean, VaR and CVaR with and without the shock on the SAME draws

# calling a given function for several values and printing (Marx Q3 style)
for Q in np.arange(0, 200_000_001, 25_000_000):
    print(f"{Q:,.0f}: {calculate_total_costs(df, Q):,.0f}")`,
    notes: "Keep the new draw after the existing ones so earlier numbers do not shift, and report how many scenarios were hit."
  },
  {
    id: "pb6", area: "sim", title: "P2 reading: state the assumptions of the random model",
    when: "Q1(a) style: which inputs are random, which distributions, independent or correlated, what each parameter means.",
    concept: "mc-assumptions",
    code: `# what to write, per draw you find in the code:
# rng.normal(130, 45, N)          -> normal, mean 130, sd 45; floored at 0 and rounded; once per scenario
# rng.uniform(0.85, 1.15)         -> any value between 0.85 and 1.15 equally likely; once per hour
# rng.triangular(0, 0.5, 2.5)     -> min 0, most likely 0.5, max 2.5 (mean 1); once per launch, scales all hours
# rng.poisson(20)                 -> a count with mean 20
# rng.uniform(0, 1) < 0.005       -> coin toss with probability 0.005
# independent: separate rng calls; correlated: one draw shared across periods, or historical rows
# seed: same seed -> same scenarios; different seed -> slightly different estimates; distributions unchanged
# sample size: mean needs ~10,000; a 99.9% CVaR needs ~100 scenarios in the tail (n ~ 100 / p)`,
    notes: "List them as bullets in a markdown cell; graders want the distribution, its parameters and the timing of the draw."
  },
  {
    id: "pb7", area: "opt", title: "P1 Q1: the four-block model, written out",
    when: "Every year. Data symbols are given; you write decisions, objective and every constraint family with its quantifier.",
    concept: "lp-blocks",
    code: `Decisions
  x[r,d] >= 0 for every region r in R and datacenter d in D: queries (thousand QPS) from r routed to d

Objective
  minimize sum over r in R, d in D of Latency[r,d] * x[r,d]

Constraints
  (service)  for every r in R:  sum over d in D of x[r,d] >= 0.9 * Traffic[r]
  (latency)  for every r in R:  sum over d in D of Latency[r,d] * x[r,d] <= 100 * sum over d in D of x[r,d]
  (capacity) for every d in D:  sum over r in R of x[r,d] <= Capacity[d]
  (non-neg)  x[r,d] >= 0 for every r, d

Network shape (Prosche): x[f,c] factory->center, y[c,r] center->retailer
  maximize sum_{c,r} P[r] y[c,r] - sum_{f,c} (m[f] + t[f,c]) x[f,c] - sum_{c,r} (s[c] + t[c,r]) y[c,r]
  for every f: sum_c x[f,c] <= K[f]          for every c: sum_r y[c,r] <= K[c]
  for every c: sum_f x[f,c] = sum_r y[c,r]   (flow balance)      for every r: sum_c y[c,r] <= D[r]

Two-index shares (Lululime): q[p,m] share of product p's weight from material m
  for every p: sum_m q[p,m] = 1;  design minimums;  for every m: sum_p D[p] W[p] q[p,m] <= K[m]
  pledge: sum_p D[p]W[p] q[p,Rec] >= 0.45 * (sum_p D[p]W[p] q[p,Rec] + sum_p D[p]W[p] q[p,Vir])`,
    notes: "One comment per constraint. Units on the decisions. Non-negativity last. Ratios multiplied out."
  },
  {
    id: "pb8", area: "opt", title: "P1 follow-ups: tiers, min-max, a new KPI constraint",
    when: "2025 Q2 and Q3; Prosche Q3 and Q4; Scroogle A3 Q3.",
    concept: "lp-tiers",
    code: `Convex cost tiers while minimizing (2025 Q2: 10,000 QPS lost per model for the first 10, 20,000 beyond)
  new decisions: l[d] >= 0 (low-loss models), h[d] >= 0 (high-loss models) for every d
  sum over d of (l[d] + h[d]) = 100
  for every d: sum over r of x[r,d] <= Capacity[d] - (10 * l[d] + 20 * h[d])
  for every d: l[d] <= 10

Concave price tiers while maximizing (Prosche Q4: 72,000 for the first 1,600 cars, 69,000 beyond)
  new decisions: s_high, s_low >= 0
  revenue term: 72000 * s_high + 69000 * s_low   (replaces 69000 * cars to SH)
  s_high + s_low = sum over c of y[c,SH];  s_high <= 1600;  (sum over c of y[c,SH] <= 2000)

Minimize the largest average (2025 Q3), all traffic served
  new decision M;  minimize M
  for every r: sum over d of x[r,d] = Traffic[r]
  for every r: M >= sum over d of Latency[r,d] * x[r,d] / Traffic[r]     (dividing by data is linear)

A KPI as a constraint at level F (Prosche Q3): for every r: sum over c of y[c,r] >= F * D[r]; re-solve for several F

Capacity that can be bought (TeaPod): Y >= 0; RHS + Y; objective - 50 * Y; Y <= 2500`,
    notes: "Say why the tier trick is valid: a falling price while maximizing, or a rising cost while minimizing. Otherwise it needs binaries."
  },
  {
    id: "pb9", area: "opt", title: "P1 Q2: fix, run and read a Gurobi snippet",
    when: "A short model with one or two bugs. Fix it, run it, report status, objective and binding constraints.",
    concept: "lp-gurobi",
    code: `model = gp.Model("name")
x = model.addVars(regions, datacenters, lb=0, name="x")             # one decision per pair, x[r, d]
model.setObjective(gp.quicksum(latency.loc[r, d] * x[r, d] for r in regions for d in datacenters),
                   gp.GRB.MINIMIZE)
for r in regions:                                                   # a family: one constraint per r
    model.addConstr(gp.quicksum(x[r, d] for d in datacenters) >= 0.9 * traffic.loc[r, "Traffic"], name=f"service {r}")
    model.addConstr(gp.quicksum(latency.loc[r, d] * x[r, d] for d in datacenters)
                    <= 100 * gp.quicksum(x[r, d] for d in datacenters), name=f"latency {r}")
for d in datacenters:
    model.addConstr(gp.quicksum(x[r, d] for r in regions) <= capacity.loc[d, "Capacity"], name=f"capacity {d}")
model.Params.OutputFlag = 0
model.optimize()

if model.Status == gp.GRB.OPTIMAL:
    print(f"objective: {model.ObjVal:,.2f}")
    for r in regions:
        for d in datacenters:
            if x[r, d].X > 1e-6: print(r, d, x[r, d].X)
elif model.Status == gp.GRB.INFEASIBLE:
    model.computeIIS()
    print([c.ConstrName for c in model.getConstrs() if c.IISConstr])

# constraint status: slack = RHS - LHS; binding when 0
for con in model.getConstrs():
    print(con.ConstrName, con.Sense, con.RHS, round(con.Slack, 3), "binding" if abs(con.Slack) < 1e-6 else "")

# bugs to hunt: >= vs <= ; MIN vs MAX ; sum vs quicksum ; wrong list in a sum ; one list in addVars for a pair ;
# x[d, r] vs x[r, d] ; constraint outside its loop ; = vs == ; lhs / rhs ratio ; x * y ; .X before optimize()`,
    notes: "After the fix, write two sentences: the status and objective, and which constraints bind and what that means for the business."
  },
];
