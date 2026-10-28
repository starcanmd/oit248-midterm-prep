/* Question bank. Every question has: id, topic, area, type, prompt, [code], [choices, answer], explanation, concept, [source]
   types: mc (multiple choice), tf (true/false), output (predict the output), bug (find and fix), write (write the model), short (short answer) */

const QUESTIONS = [

  /* =========================================================
     PYTHON: READING
     ========================================================= */
  {
    id: "py01", topic: "py-read", area: "py", type: "mc", source: "Review slides",
    prompt: `<p>Given the code below, how do you get the cost of a Maple seedling?</p>`,
    code: `tree_types = ["Maple", "Elm", "Spruce"]
plan = {"Maple": 20, "Elm": 20, "Spruce": 30}
df = pd.DataFrame({"Cost": [10.0, 6.5, 9.0], "Water": [76, 48, 34]}, index=tree_types)`,
    choices: [`<code>df["Maple"]["Cost"]</code>`, `<code>df.loc["Maple", "Cost"]</code>`, `<code>df.loc["Cost", "Maple"]</code>`, `<code>plan["Maple"]["Cost"]</code>`],
    answer: 1,
    explanation: `<p><code>df.loc[row, column]</code> takes the row first, so <code>df.loc["Maple", "Cost"]</code> gives 10.0. The column-first spelling is <code>df["Cost"]["Maple"]</code> (column, then row). Option (a) has the order backwards for the [ ] form, (c) has it backwards for .loc, and <code>plan</code> is a dictionary of counts, not costs.</p>`,
    concept: "py-structures"
  },
  {
    id: "py02", topic: "py-read", area: "py", type: "output", source: "Python prep notebook",
    prompt: `<p>What does this print?</p>`,
    code: `line = ["Ana", "Ben", "Chen"]
print(line[0], line[-1])
print(line[1:], line[:2])
line.append("Dee")
first = line.pop(0)
print(first, line, len(line))`,
    explanation: `<p><code>Ana Chen</code><br><code>['Ben', 'Chen'] ['Ana', 'Ben']</code><br><code>Ana ['Ben', 'Chen', 'Dee'] 3</code></p><p>Index 0 is the first element and &minus;1 the last. <code>[1:]</code> drops the first, <code>[:2]</code> keeps the first two. <code>append</code> adds at the end; <code>pop(0)</code> removes the first element and returns it, so Ana leaves and the list has three names.</p>`,
    concept: "py-structures"
  },
  {
    id: "py03", topic: "py-fix", area: "py", type: "bug", source: "Python prep notebook",
    prompt: `<p>This function should return the water the plan uses (3,500 for the plan above). It runs, but returns 1020. What is wrong?</p>`,
    code: `def water_used(plan):
    total = 0
    for t in tree_types:
        total = df.loc[t, "Water"] * plan[t]
    return total`,
    explanation: `<p>The loop overwrites <code>total</code> at every step instead of adding to it, so the function returns only the last term (Spruce: 34 &times; 30 = 1,020). The line should be <code>total = total + df.loc[t, "Water"] * plan[t]</code> (or <code>total += ...</code>).</p><p>A running total always needs <code>total = total + ...</code>. This "missing accumulation" is one of the most common bugs in exam code.</p>`,
    concept: "py-sums"
  },
  {
    id: "py04", topic: "py-read", area: "py", type: "mc", source: "Review slides",
    prompt: `<p>Which Python expression computes &sum;<sub>t&isin;T</sub> c<sub>t</sub> n<sub>t</sub>, the total cost of the plan, where <code>df.loc[t,"Cost"]</code> is c<sub>t</sub> and <code>plan[t]</code> is n<sub>t</sub>?</p>`,
    choices: [`<code>sum(df.loc[t, "Cost"] * plan[t] for t in tree_types)</code>`, `<code>df.loc["Cost"] * plan</code>`, `<code>sum(df.loc[t, "Cost"]) * sum(plan[t])</code>`, `<code>for t in tree_types: df.loc[t,"Cost"] * plan[t]</code>`],
    answer: 0,
    explanation: `<p>Read it aloud: "the sum, for every t in tree_types, of the cost of t times the number of trees of t". That is exactly the math. (c) multiplies two totals, which is not the same as summing products. (d) computes products but never adds them or stores them. Gurobi's <code>quicksum</code> has the identical syntax.</p>`,
    concept: "py-sums"
  },
  {
    id: "py05", topic: "py-read", area: "py", type: "output", source: "Python prep notebook",
    prompt: `<p>What does this print?</p>`,
    code: `plots = ["North", "South"]
plan_by_plot = {("Maple","North"): 10, ("Maple","South"): 10,
                ("Elm","North"): 20, ("Elm","South"): 0,
                ("Spruce","North"): 5, ("Spruce","South"): 25}
for p in plots:
    trees_on_plot = sum(plan_by_plot[t, p] for t in tree_types)
    print(f"{p}: {trees_on_plot} trees")`,
    explanation: `<p><code>North: 35 trees</code><br><code>South: 35 trees</code></p><p>North: 10 + 20 + 5 = 35. South: 10 + 0 + 25 = 35. A dictionary with pair keys is read as <code>plan_by_plot[t, p]</code> (same as <code>plan_by_plot[(t, p)]</code>). The "for every p" of the math becomes the outer for loop; the sum over t sits inside.</p>`,
    concept: "py-sums"
  },
  {
    id: "py06", topic: "py-read", area: "py", type: "mc", source: "BlueSky Q1",
    prompt: `<p>Given <code>def calculate_revenues(Demand_SS, Demand_FF, Booking_Limit_SS=120)</code>, what does the call <code>calculate_revenues(10, 20)</code> use for the booking limit?</p>`,
    choices: [`An error: three arguments are required`, `120, the default value`, `20, the last argument given`, `0`],
    answer: 1,
    explanation: `<p>An argument with a default value may be left out; the call then uses the default. <code>calculate_revenues(10, 20, 130)</code> would use 130, and <code>calculate_revenues(10, 20, Booking_Limit_SS=130)</code> does the same by name. Naming arguments is how the course changes one input at a time, e.g. <code>calculate_gross_profit(Price_Powder=12)</code>.</p>`,
    concept: "py-functions"
  },
  {
    id: "py07", topic: "py-fix", area: "py", type: "bug", source: "Marx Q3",
    prompt: `<p>A student wants the profit for each price in <code>price_test_vals</code>. The function is <code>calculate_gross_profit(Contract_Percent=0.6, Contract_Price=1.50, ..., Price_Powder=11)</code>, with Price_Powder the last of eleven arguments. What goes wrong here?</p>`,
    code: `for i in range(len(price_test_vals)):
    Marx_profit_vals[i] = calculate_gross_profit(price_test_vals[i])`,
    explanation: `<p>The value is passed positionally, so it lands in the <b>first</b> parameter, <code>Contract_Percent</code> (a price of 8.0 becomes a contract share of 800%), while <code>Price_Powder</code> stays at its default of 11. Fix: pass it by name, <code>calculate_gross_profit(Price_Powder=price_test_vals[i])</code>.</p><p>When a function has many defaulted arguments, always name the one you change.</p>`,
    concept: "py-functions"
  },
  {
    id: "py08", topic: "py-read", area: "py", type: "output", source: "Python prep notebook",
    prompt: `<p>What does this print?</p>`,
    code: `for revenue in [60_000, 90_000, 120_000]:
    if revenue < 75_000:
        label = "below"
    elif revenue < 100_000:
        label = "middle"
    else:
        label = "high"
    print(revenue, label)`,
    explanation: `<p><code>60000 below</code><br><code>90000 middle</code><br><code>120000 high</code></p><p>Python checks the conditions in order and runs the first branch whose condition holds. 90,000 is not below 75,000, so it goes to the <code>elif</code>, which is true. Underscores in numbers are only for readability.</p>`,
    concept: "py-if-minmax"
  },
  {
    id: "py09", topic: "py-read", area: "py", type: "mc", source: "Review slides",
    prompt: `<p>What is the difference between <code>np.max(a)</code> and <code>np.maximum(0, a)</code> for an array <code>a</code>?</p>`,
    choices: [`They are the same`, `<code>np.max(a)</code> returns one number (the largest element); <code>np.maximum(0, a)</code> returns an array with every negative entry replaced by 0`, `<code>np.max</code> works on lists only`, `<code>np.maximum(0, a)</code> returns the position of the largest element`],
    answer: 1,
    explanation: `<p><code>np.max</code> collapses the array to a single value. <code>np.maximum</code> is element-wise: it compares each entry with 0 (or with the matching entry of another array) and keeps the larger, so it is how the cases floor simulated demand at zero: <code>np.maximum(0, rng.normal(130, 45, N))</code>. The position of the largest element is <code>np.argmax</code>.</p>`,
    concept: "py-arrays"
  },
  {
    id: "py10", topic: "py-read", area: "py", type: "output", source: "Python prep notebook",
    prompt: `<p>What does this print?</p>`,
    code: `print(True + True + False)
print(True * 50, False * 50)
rev = np.array([60_000, 90_000, 120_000, 70_000])
print(np.sum(rev < 75_000), np.mean(rev < 75_000))`,
    explanation: `<p><code>2</code><br><code>50 0</code><br><code>2 0.5</code></p><p>True counts as 1 and False as 0. <code>rev < 75_000</code> is the array [True, False, False, True]; its sum is the count of scenarios where the condition holds (2) and its mean is the fraction (0.5), which is how a probability is estimated from a simulation.</p>`,
    concept: "py-arrays"
  },
  {
    id: "py11", topic: "py-read", area: "py", type: "mc", source: "Review slides",
    prompt: `<p>Which call gives the values 0, 0.1, 0.2, ..., 1.0 (eleven values)?</p>`,
    choices: [`<code>np.arange(0, 1, 0.1)</code>`, `<code>np.linspace(0, 1, 10)</code>`, `<code>np.linspace(0, 1, 11)</code>`, `<code>range(0, 1, 0.1)</code>`],
    answer: 2,
    explanation: `<p><code>np.linspace(start, stop, n)</code> gives n evenly spaced values <b>including</b> stop, so 11 values from 0 to 1 step 0.1. <code>np.arange(0, 1, 0.1)</code> excludes the stop and gives ten values ending at 0.9. <code>range</code> only accepts integers. Assignment 1 used <code>np.linspace(0, 1, 101)</code> for 0%, 1%, ..., 100%.</p>`,
    concept: "py-functions"
  },
  {
    id: "py12", topic: "py-read", area: "py", type: "output", source: "Marx Q3",
    prompt: `<p><code>profit_values</code> is a NumPy array whose largest value sits at position 40, and <code>price_values = np.linspace(8, 15, 71)</code>. What does this print?</p>`,
    code: `best = np.argmax(profit_values)
print(best, price_values[best])`,
    explanation: `<p><code>40 12.0</code></p><p><code>np.argmax</code> returns the <b>position</b> of the largest value, not the value. Position 40 on a grid starting at 8 with step 0.1 is 8 + 40 &times; 0.1 = 12.0. Always map the position back through the grid (<code>price_values[best]</code>); printing <code>best</code> alone only equals the decision when the grid starts at 0 with step 1 (as in BlueSky's booking limits).</p>`,
    concept: "py-arrays"
  },
  {
    id: "py13", topic: "py-read", area: "py", type: "mc", source: "Assignment 1 Q7",
    prompt: `<p><code>scenario_demands = np.array(df_scenarios)</code> is a 100 &times; 8 array: one row per scenario, one column per week. Which expression gives the average demand in each week?</p>`,
    choices: [`<code>np.mean(scenario_demands)</code>`, `<code>np.mean(scenario_demands, axis=0)</code>`, `<code>np.mean(scenario_demands, axis=1)</code>`, `<code>np.mean(scenario_demands[0])</code>`],
    answer: 1,
    explanation: `<p><code>axis=0</code> averages down the rows, giving one number per column (week), length 8. (a) is one grand average, (c) gives 100 per-scenario averages, (d) averages scenario 0 across its weeks. To pass one scenario to a function use the row: <code>scenario_demands[s]</code>.</p>`,
    concept: "py-structures"
  },
  {
    id: "py14", topic: "py-read", area: "py", type: "output", source: "Review slides",
    prompt: `<p>What does this print?</p>`,
    code: `def sales_and_lost(demands, capacity=100):
    sold = 0
    lost = 0
    for t in range(len(demands)):
        sold = sold + min(demands[t], capacity)
        lost = lost + max(0, demands[t] - capacity)
    return sold, lost

sold, lost = sales_and_lost([80, 130, 100, 125])
print(sold, lost)
result = sales_and_lost([130] * 2, capacity=120)
print(result[0], result[1])`,
    explanation: `<p><code>380 55</code><br><code>240 20</code></p><p>First call, week by week: sold = min(80,100) + min(130,100) + min(100,100) + min(125,100) = 80 + 100 + 100 + 100 = 380; lost = 0 + 30 + 0 + 25 = 55.</p><p>Second: <code>[130] * 2</code> is the list [130, 130]; with capacity 120, sold = 240 and lost = 20. A function can return several values; unpack them with <code>a, b = f(...)</code> or keep the pair and index it with <code>[0]</code>, <code>[1]</code>. Trace each <code>min</code> separately and add at the end.</p>`,
    concept: "py-functions"
  },
  {
    id: "py15", topic: "py-read", area: "py", type: "mc", source: "Study guide",
    prompt: `<p>Which line iterates through the row names of a DataFrame <code>df</code>?</p>`,
    choices: [`<code>for r in df.rows:</code>`, `<code>for r in df.index:</code>`, `<code>for r in df.columns:</code>`, `<code>for r in df:</code>`],
    answer: 1,
    explanation: `<p><code>df.index</code> holds the row names and <code>df.columns</code> the column names. (Iterating <code>for r in df:</code> actually walks column names, a common surprise.) To get a whole row as a list: <code>[df.loc["Elm", c] for c in df.columns]</code>.</p>`,
    concept: "py-structures"
  },
  {
    id: "py16", topic: "py-read", area: "py", type: "output", source: "Assignment 1 Q2",
    prompt: `<p>With <code>weeks = [0,1,...,7]</code> and <code>week_cutoff = 3</code>, what does this print?</p>`,
    code: `capacity_A = [50 if t < week_cutoff else 30 for t in weeks]
received_A = [0 if t == 0 else capacity_A[t-1] for t in weeks]
print(capacity_A)
print(received_A)`,
    explanation: `<p><code>[50, 50, 50, 30, 30, 30, 30, 30]</code><br><code>[0, 50, 50, 50, 30, 30, 30, 30]</code></p><p>The first line is a conditional inside a list comprehension: weeks 0, 1, 2 satisfy <code>t &lt; 3</code>. The second line encodes a one-week lead time: nothing arrives in week 0 and week t receives what was ordered in week t&minus;1, so the whole list shifts right by one.</p>`,
    concept: "py-if-minmax"
  },
  {
    id: "py17", topic: "py-read", area: "py", type: "mc", source: "Study guide",
    prompt: `<p>Which expression is the probability that revenue is between $75,000 and $100,000?</p>`,
    choices: [`<code>np.mean(75000 <= rev < 100000)</code>`, `<code>np.mean((rev >= 75000) & (rev < 100000))</code>`, `<code>np.mean(rev >= 75000 and rev < 100000)</code>`, `<code>np.sum(rev >= 75000) - np.sum(rev < 100000)</code>`],
    answer: 1,
    explanation: `<p>Conditions on arrays combine with <code>&</code> (and) or <code>|</code> (or), each condition in its own parentheses. Chained comparisons and the word <code>and</code> do not work element-wise on arrays. (d) subtracts two counts and gives a negative number here.</p>`,
    concept: "py-arrays"
  },

  /* =========================================================
     PYTHON: TIERS, FIX THE MODEL
     ========================================================= */
  {
    id: "py18", topic: "py-fix", area: "py", type: "output", source: "Marx Q4",
    prompt: `<p>The bracket table is below (lower limit, upper limit, marginal cost per pound). What is <code>min(df["Upper"][2] - df["Lower"][2], max(0, Q - df["Lower"][2]))</code> for Q = 80,000,000?</p>`,
    code: `#   Lower        Upper        Marginal_Cost
# 0 0            50,000,000   2.25
# 1 50,000,000   75,000,000   2.00
# 2 75,000,000   100,000,000  1.75
# 3 100,000,000  125,000,000  1.50`,
    explanation: `<p><code>5000000</code></p><p>Bracket 2 runs from 75M to 100M, so U &minus; L = 25M. Q &minus; L = 80M &minus; 75M = 5M, and max(0, 5M) = 5M. The min of 25M and 5M is 5M: five million pounds of the 80M fall in this bracket. Total cost for 80M: 50M &times; 2.25 + 25M &times; 2.00 + 5M &times; 1.75 = $171,250,000.</p>`,
    concept: "py-tiers"
  },
  {
    id: "py19", topic: "py-fix", area: "py", type: "write", source: "Marx Q4",
    prompt: `<p>Write a function <code>calculate_total_costs(df, Q)</code> that returns the total cost of buying Q pounds under the bracket contract in <code>df</code> (columns Lower, Upper, Marginal_Cost), where each pound costs the price of the bracket it falls in. Then say what it returns for Q = 60,000,000.</p>`,
    explanation: `<pre class="code">def calculate_total_costs(df, Q):
    total = 0
    for i in df.index:
        in_bracket = min(df["Upper"][i] - df["Lower"][i], max(0, Q - df["Lower"][i]))
        total = total + in_bracket * df["Marginal_Cost"][i]
    return total</pre>
<p>For 60M: 50M &times; 2.25 + 10M &times; 2.00 = <b>$132,500,000</b>. The formula min(U &minus; L, max(0, Q &minus; L)) handles all three cases (below, inside, above the bracket) without an if. An if/elif/else version is also fine: <code>if Q &lt;= L: 0</code>, <code>elif Q &lt;= U: Q - L</code>, <code>else: U - L</code>.</p>`,
    concept: "py-tiers"
  },
  {
    id: "py20", topic: "py-fix", area: "py", type: "mc", source: "Assignment 1 Q5",
    prompt: `<p>Bakers' discount is one rate applied to the whole B purchase, looked up from the total units (301 to 350 units: 4.9%). Tom orders 323 units at $30. Which is the correct B cost?</p>`,
    choices: [`30 &times; 323 &times; (1 &minus; 0.049)`, `30 &times; (100 &times; 0.98 + 100 &times; 0.969 + 100 &times; 0.96 + 23 &times; 0.951)`, `30 &times; 323 &times; 0.049`, `30 &times; 323 &times; (1 &minus; 0.04)`],
    answer: 0,
    explanation: `<p>This is an <b>all-units</b> discount: one rate on the entire quantity, $9,215.19. Option (b) is an <b>incremental</b> (marginal) tier calculation, the Fitbit and Marx Q4 structure, where each unit costs the rate of its own tier. (c) is the discount amount, not the cost; (d) uses the wrong row. Read the case to decide which structure applies before coding.</p>`,
    concept: "py-tiers"
  },
  {
    id: "py21", topic: "py-fix", area: "py", type: "bug", source: "Assignment 1 Q3",
    prompt: `<p>A classmate rewrote the discount lookup. Does it give the same answers as the original for 150, 201 and 350 units? What happens for 500 units (above the last row, 426 to 450 at 6.6%)?</p>`,
    code: `def determine_discount(total_quantity):
    for i in df_discounts.index:
        if df_discounts["Min"][i] <= total_quantity:
            discount = df_discounts["Discount"][i]
    return discount`,
    explanation: `<p>For quantities inside the table it gives the same answers: the loop keeps overwriting <code>discount</code> with the last row whose Min is at or below the quantity, and since the rows are in increasing order the last overwrite is the right tier (the same "last tier whose start you reached" pattern as Quail Resort's cost tiers). For 500 it silently returns 0.066 instead of flagging an out-of-table quantity. The original checked both <code>Min &lt;= q</code> and <code>Max &gt;= q</code> and printed an error otherwise.</p><p>Lesson: an overwrite loop relies on the rows being sorted, and boundaries need a conscious decision.</p>`,
    concept: "py-tiers"
  },
  {
    id: "py22", topic: "py-fix", area: "py", type: "output", source: "Assignment 2",
    prompt: `<p>With <code>TIER_STARTS = [0, 350_000, 450_000]</code> and <code>demand = 420_000</code>, what is <code>tier</code> after this loop?</p>`,
    code: `tier = 0
for i in range(len(TIER_STARTS)):
    if demand >= TIER_STARTS[i]:
        tier = i`,
    explanation: `<p><code>1</code></p><p>The condition holds for i = 0 (420,000 &ge; 0) and i = 1 (420,000 &ge; 350,000) but not i = 2, so the last assignment is <code>tier = 1</code>: the $4.0M to $5.0M cost tier. Because the starts increase, the last tier whose start the demand has reached is the correct one.</p>`,
    concept: "py-if-minmax"
  },
  {
    id: "py23", topic: "py-fix", area: "py", type: "bug", source: "Marx Q1",
    prompt: `<p>The case says Marx can roast 200 million lb in house and must outsource the rest, and that outsourcing carries a $100M fixed cost. Find the two logical errors in the chatbot's model and fix them.</p>`,
    code: `Amount_Roasted_Total = Beans_Total
Amount_Roasted_InHouse = Amount_Roasted_Total
Amount_Roasted_Outsourced = Amount_Roasted_Total - Amount_Roasted_InHouse
...
Cost_Fixed = Fixed_Costs if (Amount_Roasted_Total > 0) else 0`,
    explanation: `<p><b>Error 1:</b> <code>Amount_Roasted_InHouse = Amount_Roasted_Total</code> ignores the capacity. Fix: <code>Amount_Roasted_InHouse = min(Amount_Roasted_Total, Roasting_Capacity)</code>. Then the outsourced amount is correctly what exceeds 200M.</p><p><b>Error 2:</b> the fixed cost is charged whenever anything is roasted. Fix: <code>Cost_Fixed = Fixed_Costs if (Amount_Roasted_Outsourced > 0) else 0</code>.</p><p>At $11 the chatbot's model gives $879.4M; the corrected one gives $845.1M. And note why the chatbot's model cannot be trusted at other prices: the bean volume crosses 200M, so capacity and the fixed cost both matter.</p>`,
    concept: "py-if-minmax"
  },
  {
    id: "py24", topic: "py-fix", area: "py", type: "mc", source: "Marx Q1",
    prompt: `<p>Which of these lines in the Marx chatbot model is an <b>assumption</b> (a choice where the case was vague) rather than a logical error?</p>`,
    choices: [`<code>Amount_Roasted_InHouse = Amount_Roasted_Total</code>`, `<code>Sales_Powder = Demand_Powder</code>`, `<code>Cost_Fixed = Fixed_Costs if (Amount_Roasted_Total > 0) else 0</code>`, `All three are logical errors`],
    answer: 1,
    explanation: `<p>Selling the entire market demand is an assumption: the case does not say Marx must serve every customer, and at a low price it might prefer to sell less. (a) contradicts the stated 200M capacity and (c) contradicts "outsourcing incurs a fixed cost", so both are logical errors. Another assumption: "60% of anticipated need" was coded as 60% of sales.</p>`,
    concept: "mc-assumptions"
  },
  {
    id: "py25", topic: "py-fix", area: "py", type: "bug", source: "Marx Q1",
    prompt: `<p>To fix the "60% of anticipated need" ambiguity, a student writes the line below so that the contract covers 60% of everything Marx must buy. Why does this not work in Python, and what would?</p>`,
    code: `Beans_Contract = Contract_Percent * (Beans_Contract + Beans_Open_Market)`,
    explanation: `<p>It is an <b>equation</b> in Beans_Contract, not an assignment. Python evaluates the right-hand side first, which needs a value for Beans_Contract that does not exist yet (NameError) or uses a stale one. You must solve the equation on paper first: with Beans_Open_Market = Sales &minus; Beans_Contract &times; Yield, this gives Beans_Contract = 0.6 &times; Sales / (1 &minus; 0.6 &times; (1 &minus; Yield)), which can then be assigned.</p><p><code>x = expression</code> requires the expression to be independent of x.</p>`,
    concept: "py-if-minmax"
  },
  {
    id: "py26", topic: "py-fix", area: "py", type: "output", source: "Marx Q2",
    prompt: `<p>With the corrected Marx function, demand = 600M &minus; 35M &times; price, total beans = 1.09 &times; demand, capacity 200M, and a $100M fixed cost only if anything is outsourced. Profit at $11.90 is $901M and at $12.00 it is $1,000M. Why the jump of about $99M for a 10-cent change?</p>`,
    explanation: `<p>At $11.90 demand is 183.5M lb and total beans 1.09 &times; 183.5 = 200.015M, just over the 200M capacity, so Marx outsources 15,000 lb and pays the whole $100M fixed cost. At $12.00 demand is 180M, beans 196.2M, everything is roasted in house and the fixed cost disappears. The <code>if (Outsourced > 0)</code> creates a cliff in the profit curve, which is why the optimal price is exactly $12.00 (profit $999,990,000).</p>`,
    concept: "py-if-minmax"
  },
  {
    id: "py27", topic: "py-fix", area: "py", type: "write", source: "Marx Q3",
    prompt: `<p>Using the given function <code>calculate_gross_profit(..., Price_Powder=11)</code>, write code that evaluates the profit for every price in <code>np.linspace(8, 15, 71)</code>, stores the results, and prints the best price and its profit.</p>`,
    explanation: `<pre class="code">price_values = np.linspace(8, 15, 71)
profit_values = np.zeros(len(price_values))

for i, price in enumerate(price_values):
    profit_values[i] = calculate_gross_profit(Price_Powder=price)

best = np.argmax(profit_values)
print(f"best price: {price_values[best]:.2f}, profit: {np.max(profit_values):,.0f}")</pre>
<p>Three ingredients: a grid of decision values, an array of zeros to fill, a loop that calls the given function with the decision passed <b>by name</b>. Then <code>np.argmax</code> for the position and the grid for the value. A list comprehension works too: <code>[calculate_gross_profit(Price_Powder=p) for p in price_values]</code>.</p>`,
    concept: "py-functions"
  },

  /* =========================================================
     MONTE CARLO: BASICS, ASSUMPTIONS, SEEDS
     ========================================================= */
  {
    id: "mc01", topic: "mc-basics", area: "sim", type: "mc", source: "Review slides",
    prompt: `<p>In a Monte Carlo simulation stored as a DataFrame with 10,000 rows, what does one row represent?</p>`,
    choices: [`One input variable`, `One scenario: one draw from every input distribution`, `One summary statistic`, `One time period of the same scenario`],
    answer: 1,
    explanation: `<p>One row = one trial = one draw of every random input (e.g. SS demand and FF demand for one departure). The model is then applied row by row to get one output per scenario, and the 10,000 outputs form the empirical distribution you summarize. With several periods, a row still is one scenario; the periods become columns (Assignment 1: Week_0 to Week_7).</p>`,
    concept: "mc-idea"
  },
  {
    id: "mc02", topic: "mc-basics", area: "sim", type: "write", source: "BlueSky Q2",
    prompt: `<p><code>df</code> has 10,000 rows with columns Demand_SS and Demand_FF, and <code>calculate_revenues(Demand_SS, Demand_FF)</code> is given. Write the code that computes the revenue of every departure, stores it, and prints the mean revenue.</p>`,
    explanation: `<pre class="code">revenue_by_sample = np.zeros(len(df))

for s in df.index:
    revenue_by_sample[s] = calculate_revenues(Demand_SS=df["Demand_SS"][s],
                                              Demand_FF=df["Demand_FF"][s])

print(np.mean(revenue_by_sample))     # 98,727.28 in the case</pre>
<p>Initialize an array of zeros (one slot per scenario), loop over the rows, call the model, store the output, summarize. A list with <code>append</code> works just as well; the study guide says you should be able to write this yourself.</p>`,
    concept: "mc-idea"
  },
  {
    id: "mc03", topic: "mc-basics", area: "sim", type: "mc", source: "BlueSky Q2",
    prompt: `<p>Read the code. Which statement about the assumptions is correct?</p>`,
    code: `rng = np.random.default_rng(seed=12345)
Demand_SS = np.maximum(0, np.round(rng.normal(130, 45, 10_000))).astype(int)
Demand_FF = np.maximum(0, np.round(rng.normal(80, 28, 10_000))).astype(int)`,
    choices: [`SS demand is uniform between 130 and 45`, `SS demand is normal with mean 130 and standard deviation 45, rounded to whole passengers and floored at 0; SS and FF are drawn independently`, `SS and FF demands are correlated because they share the same rng`, `The seed makes every departure have the same demand`],
    answer: 1,
    explanation: `<p><code>rng.normal(loc, scale, size)</code>: loc is the mean, scale the standard deviation. The normal can go negative, hence <code>np.maximum(0, ...)</code>; <code>np.round</code> and <code>astype(int)</code> make whole passengers. Two separate calls produce independent draws; sharing one generator does not create correlation. The seed only makes the sequence reproducible.</p>`,
    concept: "py-random"
  },
  {
    id: "mc04", topic: "mc-basics", area: "sim", type: "mc", source: "Muse Q1",
    prompt: `<p>In Muse, one <code>intensity = rng.triangular(0, 0.5, 2.5)</code> is drawn per launch and multiplies the arrivals of all five hours; each hour then gets its own <code>rng.uniform(0.85, 1.15)</code> factor. The hourly arrivals within a launch are:</p>`,
    choices: [`Independent, because each hour has its own uniform draw`, `Perfectly correlated, because they share the intensity`, `Strongly but not perfectly correlated (about 0.97)`, `Negatively correlated, because the base profile declines over the hours`],
    answer: 2,
    explanation: `<p>A shared draw creates positive correlation: a launch that starts big stays big. The per-hour uniform noise keeps the correlation below 1. This is the general rule: inputs are correlated when the code makes them share a draw, when historical rows carry correlation, or when a joint distribution is sampled. Hour 1 is therefore very informative about the rest of the launch.</p>`,
    concept: "py-random"
  },
  {
    id: "mc05", topic: "mc-basics", area: "sim", type: "short", source: "Muse Q1",
    prompt: `<p>List the random inputs of <code>draw_launches</code> below, their distributions and parameters, and whether each is drawn once per launch or once per hour.</p>`,
    code: `for launch in range(n_launches):
    intensity = rng.triangular(0.0, 0.5, 2.5)
    for hour, name in enumerate(HOUR_NAMES):
        hourly = rng.uniform(0.85, 1.15)
        arrivals[name][launch] = round(BASE_PROFILE[hour] * intensity * hourly)
    quit_rates[launch] = rng.uniform(0.10, 0.30)
    noticed = arrivals["hour_1"][launch] > 10_000
    if noticed and rng.uniform(0, 1) < 0.005:
        ...   # retailer blocks: hours 2-5 keep 40%, quit rate becomes 0.85`,
    explanation: `<ul><li><b>intensity</b>: triangular with min 0, mode 0.5, max 2.5 (mean 1); once per launch; scales every hour.</li><li><b>hourly</b>: uniform between 0.85 and 1.15 (mean 1); once per hour; independent noise.</li><li><b>quit rate</b>: uniform between 0.10 and 0.30; once per launch (overridden to 0.85 if blocked).</li><li><b>retailer block</b>: a coin toss <code>rng.uniform(0,1) &lt; 0.005</code>, only evaluated if hour-1 arrivals exceed 10,000; once per launch.</li></ul><p>The study guide asks exactly this: which inputs are random, with which distributions, and which move together.</p>`,
    concept: "py-random"
  },
  {
    id: "mc06", topic: "mc-basics", area: "sim", type: "mc", source: "Review slides",
    prompt: `<p>How is "with probability 0.3 the customer buys up to full fare" coded?</p>`,
    choices: [`<code>rng.normal(0.3, 1) > 0</code>`, `<code>rng.uniform(0, 1) < 0.3</code>`, `<code>rng.triangular(0, 0.3, 1)</code>`, `<code>0.3 * rng.uniform(0, 1)</code>`],
    answer: 1,
    explanation: `<p>A uniform draw on [0, 1] is below 0.3 exactly 30% of the time, so the comparison is a coin toss that is True with probability 0.3. Muse uses it for the retailer block, Assignment 2 Q4 for the 1% closure. For many customers at once, the count of successes is <code>rng.binomial(n, p)</code>.</p>`,
    concept: "py-random"
  },
  {
    id: "mc07", topic: "mc-basics", area: "sim", type: "mc", source: "Muse Q1",
    prompt: `<p>Running <code>draw_launches(10_000, seed=2026)</code> twice gives:</p>`,
    choices: [`Different launches each time`, `Identical launches`, `Identical launches only on the same computer`, `Identical means but different rows`],
    answer: 1,
    explanation: `<p>The seed fixes the sequence of pseudo-random numbers, so the same code with the same seed reproduces the same scenarios exactly. A different seed gives a different sample with slightly different estimates; the assumed distributions do not change. Setting a seed gives replicability and fair comparisons between decisions.</p>`,
    concept: "mc-seed"
  },
  {
    id: "mc08", topic: "mc-basics", area: "sim", type: "short", source: "Study guide",
    prompt: `<p>Why do simulation estimates change with the seed and with the number of scenarios? Which statistic needs the most scenarios: the mean, a 99.9% VaR, or a 99.9% CVaR?</p>`,
    explanation: `<p>Each seed gives a different random sample, so every estimate is a sample estimate with sampling error. More scenarios shrink that error (roughly with the square root of n). The mean uses all n scenarios, so 10,000 pin it down to about 2%. A 99.9% CVaR averages only the worst 0.1%, i.e. 10 of 10,000 launches, so it moved 29% across seeds in Muse; a VaR is one point in that sparse tail (13%). Rule of thumb: you need about 100 observations in the tail, so n &asymp; 100 / p. Sample size depends on the statistic you estimate.</p>`,
    concept: "mc-seed"
  },
  {
    id: "mc09", topic: "mc-basics", area: "sim", type: "bug", source: "Assignment 2",
    prompt: `<p>A student moved <code>rng = np.random.default_rng(seed)</code> from inside <code>simulate_profit</code> to the top of the notebook. The price sweep (one call per price) then gives a bumpier mean-profit curve. Why?</p>`,
    explanation: `<p>With the generator created once, each price in the sweep draws fresh seasons, so differences between prices mix the true price effect with sampling noise. Inside the function the generator restarts from the seed at every call, so every price is evaluated on identical seasons (common random numbers) and the comparison is fair. Compare decisions on the same scenarios.</p>`,
    concept: "mc-seed"
  },
  {
    id: "mc10", topic: "mc-basics", area: "sim", type: "mc", source: "BlueSky Q1",
    prompt: `<p>The intern's BlueSky revenue function gives the right answer at the mean demands (130, 80) but is wrong. Why can running it at the average inputs not reveal the error?</p>`,
    choices: [`Because the average inputs are never integers`, `Because the bug only shows when SS demand is below the booking limit of 120, and 130 is above it`, `Because the seed was not set`, `Because revenue at the mean is always the mean revenue`],
    answer: 1,
    explanation: `<p>The buggy line <code>Sales_FF = min(Demand_FF, Capacity - Booking_Limit_SS)</code> agrees with the correct <code>Capacity - Sales_SS</code> whenever SS demand &ge; 120. At the means both sell 120 SS and 80 FF seats: $110,000. The error only appears on departures with weak SS demand. Errors are found by reading the code against the case, not by running it on one convenient input; plotting the output over a range of inputs also helps.</p>`,
    concept: "mc-assumptions"
  },

  /* =========================================================
     MONTE CARLO: FLAW OF AVERAGES
     ========================================================= */
  {
    id: "mc11", topic: "mc-flaw", area: "sim", type: "mc", source: "BlueSky Q2",
    prompt: `<p>Revenue at the mean demands is $110,000 but the mean revenue over 10,000 departures is $98,727. A colleague says the simulation must have drawn demands with the wrong mean. The sample means are 130.1 and 80.4. What is the real cause?</p>`,
    choices: [`The seed was wrong`, `The flaw of averages: revenue is capped by the min with seats available, so high-demand departures cannot compensate for low-demand ones`, `Rounding to whole passengers`, `FF demand should have been drawn first`],
    answer: 1,
    explanation: `<p>The demand means check out, so the gap comes from the shape of the revenue function. Below-average demand loses real revenue; above-average demand is capped by the booking limit and the plane, so the upside is truncated. The average of the capped outputs sits below the output at the average input. Jensen: for a concave f, f(mean X) &ge; mean f(X), so using the means overestimates.</p>`,
    concept: "mc-flaw"
  },
  {
    id: "mc12", topic: "mc-flaw", area: "sim", type: "mc", source: "Review slides",
    prompt: `<p>For which kind of output does plugging in average inputs tend to <b>underestimate</b> the true average?</p>`,
    choices: [`Profits and revenues with capacity caps (concave)`, `Costs, taxes and penalties that grow faster than linearly (convex)`, `Any linear output`, `Never; averages always overestimate`],
    answer: 1,
    explanation: `<p>Jensen's inequality: concave f gives f(mean) &ge; mean f (rosy picture, as in BlueSky revenue); convex f gives f(mean) &le; mean f (too optimistic about a cost). For a linear output the two coincide, which is the only case where "just one number" is safe.</p>`,
    concept: "mc-flaw"
  },
  {
    id: "mc13", topic: "mc-flaw", area: "sim", type: "short", source: "Assignment 1 Q7",
    prompt: `<p>Giga-Tech's profit at the Table 1 demands is $10,908 and the average over 100 demand scenarios is $9,683, although the scenarios average exactly Table 1 week by week. Sourcing is fixed. Explain in two or three sentences.</p>`,
    explanation: `<p>With sourcing fixed, costs are identical in every scenario, so the whole gap is revenue. Revenue runs through <code>orders_filled[t] = min(demands[t], GT_units_available)</code>: when demand comes in above forecast Giga-Tech cannot sell more than it built, so the upside is capped, while below-forecast demand loses real sales. A capped (concave) relationship makes the average of the outputs lower than the output at the average input. The Table 1 figure is not wrong; it answers a different question (the one world where demand is exactly on forecast every week).</p>`,
    concept: "mc-flaw"
  },
  {
    id: "mc14", topic: "mc-flaw", area: "sim", type: "mc", source: "Assignment 2 Q1",
    prompt: `<p>In Quail Resort, average simulated demand is 575,897 (below the 600,000 capacity) and "profit at the averages" is $32.58M, above the simulated mean of $30.65M. Which single line of the model is responsible?</p>`,
    choices: [`<code>snowfall = rng.triangular(120, 175, 200)</code>`, `<code>served = min(demand, CAPACITY)</code>`, `<code>cost = rng.uniform(COST_LOW[tier], COST_HIGH[tier])</code>`, `<code>profit[t] = price * served - cost</code>`],
    answer: 1,
    explanation: `<p>The average season is served in full because 575,897 &lt; 600,000, but in real seasons demand above capacity earns nothing extra while demand below it loses revenue. The <code>min</code> creates the concave cap, hence the flaw of averages. Note the tier lookup uses <code>demand</code>, not <code>served</code>, because the case says the cost tier is set by the season's demand.</p>`,
    concept: "mc-flaw"
  },
  {
    id: "mc15", topic: "mc-flaw", area: "sim", type: "tf", source: "Assignment 1 Q7",
    prompt: `<p>True or false: uncertainty in an input always lowers the average profit relative to the profit at the average input.</p>`,
    choices: [`True`, `False`],
    answer: 1,
    explanation: `<p>False. The direction depends on the shape of the output function (concave: lower; convex: higher; linear: no change), and the size depends on whether the uncertain input actually binds. In Giga-Tech at 50/50 sourcing the gap nearly vanishes (6,312 vs 6,308) because the firm can only build 158 towers against 317 of demand, so it sells everything in almost every scenario and the demand shape stops mattering.</p>`,
    concept: "mc-flaw"
  },

  /* =========================================================
     MONTE CARLO: RISK MEASURES
     ========================================================= */
  {
    id: "mc16", topic: "mc-risk", area: "sim", type: "output", source: "BlueSky Q3",
    prompt: `<p><code>revenue_by_sample</code> holds 10,000 revenues. What does each line compute, and what is <code>cutoff</code>?</p>`,
    code: `ordered = np.sort(revenue_by_sample)
cutoff = int(0.10 * len(ordered))
worst = ordered[:cutoff]
print(worst[-1])
print(np.mean(worst))`,
    explanation: `<p><code>cutoff</code> = 1,000. <code>np.sort</code> orders ascending so <code>ordered[:1000]</code> are the 1,000 lowest revenues, the worst 10% of departures. <code>worst[-1]</code> is the largest of them: the boundary where the bad tail starts, the Value at Risk at 90% ($72,600 in the case). <code>np.mean(worst)</code> is the average over the worst decile, the Conditional Value at Risk at 90% ($60,263).</p>`,
    concept: "mc-risk"
  },
  {
    id: "mc17", topic: "mc-risk", area: "sim", type: "output", source: "Muse Q2",
    prompt: `<p><code>lost</code> is compute units lost (high is bad). What are <code>var</code> and <code>cvar</code>?</p>`,
    code: `lost = np.array([0, 0, 50, 200, 800, 1000, 3000, 9000, 12000, 20000])
TAIL = 0.2
ordered = np.sort(lost)
cutoff = int(TAIL * len(ordered))
worst = ordered[-cutoff:]
var = worst[0]
cvar = np.mean(worst)`,
    explanation: `<p><code>cutoff</code> = 2, <code>worst</code> = [12000, 20000], <b>var = 12,000</b>, <b>cvar = 16,000</b> (the mean of all ten is 4,605).</p><p>For a <b>loss</b> the bad tail is the top of the sorted array, so the slice is <code>[-cutoff:]</code> and the VaR is the smallest value in it. For a <b>revenue or profit</b> (BlueSky, Quail) the bad tail is the bottom, <code>[:cutoff]</code>, and the VaR is the largest value in it. Getting the direction right is a classic exam check.</p>`,
    concept: "mc-risk"
  },
  {
    id: "mc18", topic: "mc-risk", area: "sim", type: "bug", source: "Assignment 2 Q2",
    prompt: `<p>A student copied the Muse code to compute the 95% VaR and CVaR of Quail Resort's <b>profit</b>. What do they actually get?</p>`,
    code: `ordered = np.sort(profit)
cutoff = int(0.05 * len(ordered))
worst = ordered[-cutoff:]
var = worst[0]
cvar = np.mean(worst)`,
    explanation: `<p>The best 5% of seasons. Profits sorted ascending put the highest at the end, so <code>ordered[-cutoff:]</code> is the top 5%; the "VaR" becomes the 95th percentile and the "CVaR" the average of the best seasons. For a profit, low is bad: use <code>worst = ordered[:cutoff]</code>, <code>var = worst[cutoff - 1]</code> (the 5th percentile, $21,162,402 in the assignment) and <code>cvar = np.mean(worst)</code> ($19,473,603).</p>`,
    concept: "mc-risk"
  },
  {
    id: "mc19", topic: "mc-risk", area: "sim", type: "mc", source: "Muse Q2(b)",
    prompt: `<p>Muse, 10,000 launches. Making the retailer's block <b>more damaging</b> (keep 40% to 0%) left the mean at about 700 and the 99.9% VaR at 9,694 exactly, but raised the 99.9% CVaR from 11,881 to 13,647. Why did the VaR not move at all?</p>`,
    choices: [`The seed was the same, so nothing could change`, `VaR is the threshold where the worst 0.1% begins; making launches that are already above it worse does not move the tenth-worst launch`, `VaR is an average and averages are stable`, `Only two launches were blocked, so the data is wrong`],
    answer: 1,
    explanation: `<p>VaR is a percentile: it sees <b>frequency</b> (how many launches are bad) but not <b>severity</b> (how bad they are). The two blocked launches were already inside the worst ten; worsening them changes the average of the worst ten (CVaR) but not the boundary. When the block became ten times more likely, ten blocked launches filled the tail and both measures jumped (VaR +76%, CVaR +56%) while the mean barely moved.</p>`,
    concept: "mc-risk"
  },
  {
    id: "mc20", topic: "mc-risk", area: "sim", type: "short", source: "Muse Q2(b)",
    prompt: `<p>Muse must promise a service level to the launch team. Should the promise be written in terms of VaR or CVaR, and what else should be stated with it?</p>`,
    explanation: `<p>On <b>CVaR</b>: it averages the bad tail, so the severity of a catastrophe enters the promise directly, and the promise tightens if the retailer's response gets worse. A VaR promise ("no more than 0.1% of launches lose more than X") would not change however catastrophic the blocked launches became. State the confidence level, and state how many simulated launches support the estimate: at 99.9% the CVaR rests on only n &times; 0.001 launches, which moved 29% across seeds at 10,000 launches.</p>`,
    concept: "mc-risk"
  },
  {
    id: "mc21", topic: "mc-risk", area: "sim", type: "mc", source: "Assignment 2 Q4",
    prompt: `<p>Quail Resort adds a 1% chance of closure per season (20% of customers served, full cost). Mean profit fell 1%, VaR at 95% fell 3%, CVaR at 95% fell 21%. Which explanation is right?</p>`,
    choices: [`The closures are spread evenly across all seasons`, `The roughly 100 closed seasons land deep inside the worst 500, so the average of the worst 500 absorbs them while the 500th-worst value is set by ordinary bad seasons`, `The VaR should have fallen the most because it is the most sensitive measure`, `The mean is unaffected by rare events by definition`],
    answer: 1,
    explanation: `<p>The mean dilutes 100 bad seasons across 10,000. The VaR is the boundary of the worst 5%, set by ordinary bad seasons near it, so it barely shifts. The CVaR averages the worst 500 and the closures are all in there. Same lesson as Muse: VaR sees frequency, CVaR sees frequency and severity, the mean barely sees a rare catastrophe.</p>`,
    concept: "mc-risk"
  },
  {
    id: "mc22", topic: "mc-risk", area: "sim", type: "write", source: "Assignment 2 Q2",
    prompt: `<p><code>demands</code> is an array of simulated seasonal demands and capacity is 600,000. Write code for the probability that Quail turns away at least 50,000 customers.</p>`,
    explanation: `<pre class="code">turned_away = np.zeros(len(demands))
for t in range(len(demands)):
    turned_away[t] = max(demands[t] - CAPACITY, 0)
print(np.mean(turned_away >= 50_000))        # 0.2614 in the assignment</pre>
<p>Or in one line: <code>np.mean(np.maximum(demands - CAPACITY, 0) >= 50_000)</code>. Turned-away customers are not part of the profit output, so they are reconstructed from the stored demands; a probability is the mean of a True/False array.</p>`,
    concept: "py-arrays"
  },

  /* =========================================================
     MONTE CARLO: STAGES
     ========================================================= */
  {
    id: "mc23", topic: "mc-stages", area: "sim", type: "bug", source: "BlueSky Q1",
    prompt: `<p>Plane capacity 200, booking limit 120 on super saver (SS) seats, which sell first; full fare (FF) sells the seats that are left. Fix the intern's function.</p>`,
    code: `def calculate_revenues_analyst(Demand_SS, Demand_FF):
    Sales_SS = min(Demand_SS, Booking_Limit_SS)
    Sales_FF = min(Demand_FF, Capacity - Booking_Limit_SS)
    return Sales_SS * Price_SS + Sales_FF * Price_FF`,
    explanation: `<p>The FF line reserves exactly 80 seats whatever SS actually sold. The seats left for FF are the ones SS did not take: <code>Sales_FF = min(Demand_FF, Capacity - Sales_SS)</code>. Example: SS demand 90, FF demand 100: correct revenue 90 &times; 350 + 100 &times; 850 = $116,500; the intern's version gives $99,500 and leaves 30 seats empty.</p><p>Stage logic: given = min(still needed, available); available &minus; given carries to the next stage.</p>`,
    concept: "mc-stages"
  },
  {
    id: "mc24", topic: "mc-stages", area: "sim", type: "output", source: "BlueSky Q1",
    prompt: `<p>With the corrected function (<code>Sales_FF = min(Demand_FF, Capacity - Sales_SS)</code>, capacity 200, prices SS $350 and FF $850), what do these print?</p>`,
    code: `print(calculate_revenues(60, 150))
print(calculate_revenues(150, 30, 100))`,
    explanation: `<p><code>140000</code><br><code>60500</code></p><p>First: Sales_SS = min(60, 120) = 60; seats left 140; Sales_FF = min(150, 140) = 140; revenue 21,000 + 119,000 = $140,000. Second: the third argument sets the limit to 100; Sales_SS = min(150, 100) = 100; Sales_FF = min(30, 100) = 30; revenue 35,000 + 25,500 = $60,500.</p>`,
    concept: "mc-stages"
  },
  {
    id: "mc25", topic: "mc-stages", area: "sim", type: "bug", source: "Muse Q1(b)",
    prompt: `<p>The case says requests not served in an hour wait and compete for the next hour's capacity; the queue carries over, capacity does not. Also, users who never came because the retailer blocked Muse (<code>never_came</code>) should count as lost. Find the two flaws.</p>`,
    code: `def run_launch(capacity, arrivals, quit_rate, never_came):
    backlog = 0
    total_delay = 0
    gave_up = 0
    for hour in range(HOURS):
        waiting = arrivals[hour]
        served = min(waiting, capacity)
        backlog = waiting - served
        total_delay = total_delay + backlog
        quitters = round(backlog * quit_rate)
        gave_up = gave_up + quitters
        backlog = backlog - quitters
    cost = CAPACITY_COST * capacity * HOURS + DELAY_COST * total_delay
    lost = gave_up
    return cost, lost, total_delay`,
    explanation: `<p><b>Logical error:</b> <code>waiting = arrivals[hour]</code> drops the backlog; it should be <code>waiting = backlog + arrivals[hour]</code>. The backlog computed at the end of each hour was never used in the next, so unserved work vanished.</p><p><b>Business omission:</b> <code>never_came</code> is received but never read; <code>lost = gave_up + never_came</code>. A parameter that arrives and is never used is the tell.</p><p>After the fixes, mean cost at capacity 5,000 rose from $2.87M to $3.40M and mean units lost from 295 to 699.</p>`,
    concept: "mc-stages"
  },
  {
    id: "mc26", topic: "mc-stages", area: "sim", type: "output", source: "Muse Q1(b)",
    prompt: `<p>Trace the <b>corrected</b> <code>run_launch</code> (waiting = backlog + arrivals) with capacity 5,000, arrivals [7000, 5000, 3000, 2000, 1500], quit rate 0.2, never_came 0, CAPACITY_COST 100, DELAY_COST 250. What does it return?</p>`,
    explanation: `<p><b>(3400000, 720, 3600)</b></p><table><tr><th>Hour</th><th>waiting</th><th>served</th><th>backlog</th><th>delay so far</th><th>quitters</th><th>carried</th></tr><tr><td>1</td><td>7000</td><td>5000</td><td>2000</td><td>2000</td><td>400</td><td>1600</td></tr><tr><td>2</td><td>6600</td><td>5000</td><td>1600</td><td>3600</td><td>320</td><td>1280</td></tr><tr><td>3</td><td>4280</td><td>4280</td><td>0</td><td>3600</td><td>0</td><td>0</td></tr></table><p>Hours 4 and 5 are served in full. Cost = 100 &times; 5000 &times; 5 + 250 &times; 3600 = 2,500,000 + 900,000. The buggy version would give (3000000, 400, 2000) because hour 2 forgets the 1,600 carried over.</p>`,
    concept: "mc-stages"
  },
  {
    id: "mc27", topic: "mc-stages", area: "sim", type: "write", source: "2025 midterm P2 Q1",
    prompt: `<p>2025 exam style. Each month: arrivals join everyone already in the system; as many as possible go into THUs (capacity <code>THU_cap</code>); the rest go to hotel rooms, limited by rooms available and by what the budget can pay (<code>np.floor(budget/rate)</code>); the remainder are unhoused; the budget pays for the rooms used. Fill in the six lines.</p>`,
    code: `for t in range(12):
    ref_in_need_t = ...
    ref_THU[t+1] = ...
    ref_in_need_hotel_t = ...
    ref_hotel[t+1] = ...
    ref_unhoused[t+1] = ...
    budget_avail[t+1] = ...`,
    explanation: `<pre class="code">ref_in_need_t = new_arrivals[t] + ref_THU[t] + ref_hotel[t] + ref_unhoused[t]
ref_THU[t+1] = min(ref_in_need_t, THU_cap)
ref_in_need_hotel_t = ref_in_need_t - ref_THU[t+1]
ref_hotel[t+1] = min(ref_in_need_hotel_t, hotel_rooms_avail[t], np.floor(budget_avail[t] / room_rates[t]))
ref_unhoused[t+1] = ref_in_need_hotel_t - ref_hotel[t+1]
budget_avail[t+1] = budget_avail[t] - ref_hotel[t+1] * room_rates[t]</pre>
<p>Stages in order: THUs first, then hotels, then unhoused. Everyone in the system carries over (THU, hotel and unhoused refugees are all re-evaluated each month). Each stage is "given = min(still needed, available)"; what is still needed passes to the next stage. The hotel stage has two limits at once (rooms and money), so the min has three arguments. Total unhoused = <code>np.sum(ref_unhoused)</code>; remaining budget = <code>budget_avail[12]</code>.</p>`,
    concept: "mc-stages"
  },
  {
    id: "mc28", topic: "mc-stages", area: "sim", type: "bug", source: "Assignment 1 Q4",
    prompt: `<p>Giga-Tech assembles as many towers as parts allow every week, whether needed or not, and unsold towers carry over. A student wrote the assembly line below. What is wrong?</p>`,
    code: `assembled[t] = min(A_parts, B_parts, weekly_orders[t])`,
    explanation: `<p>Adding demand to the <code>min</code> builds only to this week's demand, contradicting the case stipulation "as many as parts allow". Consequences: towers that should be built ahead of a big week (week 2, demand 56) are not, the $5 small-parts cost and the inventory carried change. Correct: <code>assembled[t] = min(A_parts, B_parts)</code>, then shipping is <code>orders_filled[t] = min(weekly_orders[t], avail_GT + assembled[t])</code>. Three mins do all the work: assembly, shipping, and leftovers carried through <code>avail_A</code>, <code>avail_B</code>, <code>avail_GT</code>.</p>`,
    concept: "mc-stages"
  },
  {
    id: "mc29", topic: "mc-stages", area: "sim", type: "output", source: "Assignment 1 Q4",
    prompt: `<p>Giga-Tech, week 5: parts available A = 41, B = 60; towers carried from last week 25; demand 50. How many towers are assembled, shipped and carried to next week, and what parts are left?</p>`,
    explanation: `<p>Assembled = min(41, 60) = <b>41</b>. Towers available = 25 + 41 = 66; shipped = min(50, 66) = <b>50</b>; carried = <b>16</b>. Parts left: A = 41 &minus; 41 = <b>0</b>, B = 60 &minus; 41 = <b>19</b>. From this week on A is the bottleneck (its capacity dropped to 30), and B piles up.</p>`,
    concept: "mc-stages"
  },
  {
    id: "mc30", topic: "mc-stages", area: "sim", type: "mc", source: "Review slides",
    prompt: `<p>In the "modeling in stages" table, which quantity is <b>lost</b> in the Muse model?</p>`,
    choices: [`The backlog of requests`, `Unused compute units in an hour, and demand that quits`, `The quit rate`, `Capacity reserved for later hours`],
    answer: 1,
    explanation: `<p>The queue carries over (less those who quit); unused capacity in an hour is gone and quitters are gone. The two questions to ask of every model: does a quantity carry over to the next stage or is it lost; does a limit reset or is it used up by what came before. In BlueSky, seats not sold to SS carry over to FF; SS demand beyond the limit is lost.</p>`,
    concept: "mc-stages"
  },

  /* =========================================================
     MONTE CARLO: COMPARING DECISIONS
     ========================================================= */
  {
    id: "mc31", topic: "mc-decide", area: "sim", type: "write", source: "BlueSky Q4",
    prompt: `<p><code>ss_values</code> and <code>ff_values</code> are the 10,000 simulated demands and <code>calculate_revenues(ss, ff, limit)</code> is given. Write code that finds the booking limit from 0 to 200 that maximizes mean revenue.</p>`,
    explanation: `<pre class="code">booking_limit_values = np.arange(0, 201)
mean_revenue_values = np.zeros(len(booking_limit_values))

for i, limit in enumerate(booking_limit_values):
    revenues = np.zeros(len(ss_values))
    for s in range(len(ss_values)):
        revenues[s] = calculate_revenues(ss_values[s], ff_values[s], limit)
    mean_revenue_values[i] = np.mean(revenues)

best = np.argmax(mean_revenue_values)
print(booking_limit_values[best], mean_revenue_values[best])   # 113, $98,918.60</pre>
<p>Every limit is evaluated on the <b>same</b> 10,000 departures, so the comparison is fair. The grid starts at 0 with step 1, so here the index equals the limit, but index into the grid anyway.</p>`,
    concept: "mc-decisions"
  },
  {
    id: "mc32", topic: "mc-decide", area: "sim", type: "mc", source: "BlueSky Q4",
    prompt: `<p>BlueSky: mean revenue is maximized at a booking limit of 113; the worst-decile average is maximized at 186. What should Maria do?</p>`,
    choices: [`Choose 113; the mean is the only objective that matters`, `Choose 186; protecting the downside is always right`, `Average the two: 150`, `It depends on her risk preferences; the model cannot reconcile the two objectives, and moving from 113 to 186 trades about $1.90 of mean revenue per $1 of downside protection`],
    answer: 3,
    explanation: `<p>Mean &minus; $6,776 and worst decile + $3,507 between 113 and 186. If this route is one of hundreds, take the mean; if a bad quarter must be personally explained, pay for protection. Both curves are flat near their peaks, so argue about bands (104 to 123 vs 159 to 192), not digits. To recommend decisions under uncertainty you must know the risk preferences.</p>`,
    concept: "mc-decisions"
  },
  {
    id: "mc33", topic: "mc-decide", area: "sim", type: "short", source: "BlueSky Q4",
    prompt: `<p>Why does protecting the worst departures mean a <b>higher</b> booking limit (186) in BlueSky, i.e. selling more discount seats?</p>`,
    explanation: `<p>Bad departures are weak-demand departures, and on those the booking limit never binds (it only bites when SS demand exceeds it, which happens on good departures). Raising the limit costs nothing on a bad day and picks up revenue when SS sells unexpectedly well. A downside measure on revenue cannot push toward scarcity, because scarcity is not what makes a departure bad here. Correlated demands change this: with rho = 0.6 the tail-optimal limit falls to 153.</p>`,
    concept: "mc-decisions"
  },
  {
    id: "mc34", topic: "mc-decide", area: "sim", type: "write", source: "2025 midterm P2 Q3",
    prompt: `<p>2025 exam style. <code>calculate_mean_values(new_THU_built)</code> returns (mean unhoused, mean remaining budget). Write code that finds the number of THUs (multiples of 10, from 0 up to what the budget allows) that minimizes mean unhoused while keeping mean remaining budget &ge; 500,000, and correctly reports if no option is feasible.</p>`,
    explanation: `<pre class="code">THU_values = np.arange(0, budget / THU_cost, 10)
optimal_unhoused = np.inf           # nothing found yet

for n in THU_values:
    mean_unhoused, mean_budget = calculate_mean_values(new_THU_built=n)
    if (mean_budget >= 500_000) and (mean_unhoused < optimal_unhoused):
        optimal_THU = n
        optimal_unhoused = mean_unhoused

if optimal_unhoused < np.inf:
    print(optimal_THU, optimal_unhoused)      # 290 in the 2025 solution
else:
    print("No option is feasible.")</pre>
<p>Pattern: loop over the decision grid, keep a running best, accept a candidate only if it satisfies the constraint <b>and</b> improves the objective, and start the best at infinity so "no feasible option" is detectable. Starting at 0 would fail when every profit is negative.</p>`,
    concept: "mc-decisions"
  },
  {
    id: "mc35", topic: "mc-decide", area: "sim", type: "write", source: "2025 midterm P2 Q2",
    prompt: `<p>2025 exam style. <code>arrivals_df</code>, <code>rooms_df</code> and <code>rates_df</code> each have 10 rows (years 0 to 9) and 12 columns (months 0 to 11). <code>run_simulation_one_year(new_arrivals, hotel_rooms_avail, room_rates, new_THU_built, ...)</code> returns (unhoused, remaining budget) for one year of inputs given as lists. Write a function that takes the number of THUs to build and returns the mean of each output over the 10 historical years, treated as equally likely scenarios.</p>`,
    explanation: `<pre class="code">def calculate_mean_values(new_THU_built):
    num_years = len(arrivals_df)
    months = list(arrivals_df.columns)
    unhoused_by_year = np.zeros(num_years)
    budget_by_year = np.zeros(num_years)
    for y in range(num_years):
        arrivals_y = [arrivals_df[m][y] for m in months]
        rooms_y = [rooms_df[m][y] for m in months]
        rates_y = [rates_df[m][y] for m in months]
        unhoused_by_year[y], budget_by_year[y] = run_simulation_one_year(
            new_arrivals=arrivals_y, hotel_rooms_avail=rooms_y,
            room_rates=rates_y, new_THU_built=new_THU_built)
    return np.mean(unhoused_by_year), np.mean(budget_by_year)</pre>
<p>One row = one scenario with one column per month; build the list for the year with a comprehension over the columns (<code>df[m][y]</code> is column m, row y), call the given function by keyword, store both outputs, average. Historical rows as equally likely scenarios is the empirical distribution.</p>`,
    concept: "mc-idea"
  },
  {
    id: "mc36", topic: "mc-decide", area: "sim", type: "mc", source: "Assignment 2 Q3",
    prompt: `<p>Quail Resort: mean profit is highest at a price of $86 (CVaR $17.3M); CVaR at 95% is highest at $72 (mean $32.6M). A manager who wants to protect the worst seasons should:</p>`,
    choices: [`Charge $86; the mean is what matters`, `Charge $72, or something between $72 and $86, giving up some mean profit for a better worst-5% average`, `Charge $120 to maximize revenue per customer`, `Charge $50 to never turn customers away`],
    answer: 1,
    explanation: `<p>A higher price trades customers for margin; on average that pays up to $86, but in poor seasons the lost customers are the ones the resort cannot spare. The plot of mean and CVaR against price is the input to the choice; the risk preference decides where on it to sit.</p>`,
    concept: "mc-decisions"
  },

  /* =========================================================
     OPTIMIZATION: FOUR BLOCKS AND DECISIONS
     ========================================================= */
  {
    id: "lp01", topic: "lp-blocks", area: "opt", type: "write", source: "Oro Verde handout",
    prompt: `<p>Oro Verde chooses how many seedlings of each type t &isin; T to plant. Data: c<sub>t</sub> cost, &ell;<sub>t</sub> land per tree, w<sub>t</sub> water per tree, p<sub>t</sub> survival rate, s<sub>t</sub> sequestration of a mature tree, a<sub>t</sub> seedlings available; L land, W water, C carbon commitment, E minimum elms. Minimize cost. Write the model in four blocks.</p>`,
    explanation: `<p><b>Decisions:</b> x<sub>t</sub> &ge; 0, seedlings of type t planted, for every t &isin; T.</p><p><b>Objective:</b> minimize &sum;<sub>t&isin;T</sub> c<sub>t</sub> x<sub>t</sub>.</p><p><b>Constraints:</b></p><ul><li>land: &sum;<sub>t</sub> &ell;<sub>t</sub> x<sub>t</sub> &le; L</li><li>water: &sum;<sub>t</sub> w<sub>t</sub> x<sub>t</sub> &le; W</li><li>availability: x<sub>t</sub> &le; a<sub>t</sub> for every t &isin; T</li><li>elms: x<sub>Elm</sub> &ge; E</li><li>sequestration: &sum;<sub>t</sub> p<sub>t</sub> s<sub>t</sub> x<sub>t</sub> &ge; C</li><li>non-negativity: x<sub>t</sub> &ge; 0 for every t</li></ul><p>Note the coefficient p<sub>t</sub>s<sub>t</sub> is a product of two data items: still linear. Write "for every t" on each family.</p>`,
    concept: "lp-blocks"
  },
  {
    id: "lp02", topic: "lp-blocks", area: "opt", type: "write", source: "Diet Q1",
    prompt: `<p>Diet problem. Data: set F of foods, set N<sub>min</sub> of nutrients with a minimum; P<sub>f</sub> price per 100 g of food f; D<sub>f,n</sub> content of nutrient n in 100 g of food f; L<sub>n</sub> daily minimum of nutrient n. Write the cheapest-diet model.</p>`,
    explanation: `<p><b>Decisions:</b> q<sub>f</sub> &ge; 0 for every f &isin; F: amount of food f per day, in 100 g units.</p><p><b>Objective:</b> minimize &sum;<sub>f&isin;F</sub> P<sub>f</sub> q<sub>f</sub>.</p><p><b>Constraints:</b> for every nutrient n &isin; N<sub>min</sub>: &sum;<sub>f&isin;F</sub> D<sub>f,n</sub> q<sub>f</sub> &ge; L<sub>n</sub>; q<sub>f</sub> &ge; 0.</p><p>Pseudocode: <code>for every n in Nmin: sum over f in F of D[f,n] * q[f] >= L[n]</code>. State the unit of the decision; if you chose grams, divide P and D by 100. Seven of the 25 minimums bind in the $1.53 solution.</p>`,
    concept: "lp-blocks"
  },
  {
    id: "lp03", topic: "lp-blocks", area: "opt", type: "write", source: "2025 midterm P1 Q1",
    prompt: `<p>2025 exam. Regions R and datacenters D. Latency<sub>r,d</sub> (ms), Traffic<sub>r</sub> (QPS) and Capacity<sub>d</sub> (QPS) are given. Route queries to minimize total latency such that (i) at least 90% of each region's queries are served, (ii) the average latency of served queries in each region is at most 100 ms, (iii) no datacenter is overloaded. Write the model.</p>`,
    explanation: `<p><b>Decisions:</b> x<sub>r,d</sub> &ge; 0, QPS from region r routed to datacenter d, for every r &isin; R, d &isin; D (16 decisions).</p><p><b>Objective:</b> minimize &sum;<sub>r</sub>&sum;<sub>d</sub> Latency<sub>r,d</sub> x<sub>r,d</sub>.</p><p><b>Constraints:</b></p><ul><li>service: &sum;<sub>d</sub> x<sub>r,d</sub> &ge; 0.9 Traffic<sub>r</sub> for every r</li><li>average latency (ratio multiplied out): &sum;<sub>d</sub> Latency<sub>r,d</sub> x<sub>r,d</sub> &le; 100 &sum;<sub>d</sub> x<sub>r,d</sub> for every r</li><li>capacity: &sum;<sub>r</sub> x<sub>r,d</sub> &le; Capacity<sub>d</sub> for every d</li><li>x<sub>r,d</sub> &ge; 0</li></ul><p>Rubric: decisions 5, objective 4, each constraint family 5, non-negativity 1. An optional &sum;<sub>d</sub> x<sub>r,d</sub> &le; Traffic<sub>r</sub> is harmless but not needed when minimizing latency. Fractions f<sub>r,d</sub> of traffic also work.</p>`,
    concept: "lp-blocks"
  },
  {
    id: "lp04", topic: "lp-blocks", area: "opt", type: "mc", source: "Review slides",
    prompt: `<p>When does a model need decisions with <b>two</b> indices?</p>`,
    choices: [`Whenever there are two constraints`, `When the data or the requirements involve pairs (product &times; material, factory &times; center, region &times; datacenter), so that costs or shares must be expressed per pair`, `Only in network problems`, `Never; one index is always enough`],
    answer: 1,
    explanation: `<p>Look at how the data is presented: a table of pairs means a decision per pair. Lululime needs q<sub>p,m</sub> because the design minimum applies per product and the supply per material; Prosche's transport costs are per arc; Scroogle's CTR and payment are per (user, advertiser). More decisions are fine as long as the count does not explode, and they make every expression a plain sum of coefficient &times; decision.</p>`,
    concept: "lp-decisions"
  },
  {
    id: "lp05", topic: "lp-blocks", area: "opt", type: "mc", source: "Lululime Q1",
    prompt: `<p>Lululime: a classmate defines y<sub>p,m</sub> = total kg of material m used for product p instead of the share q<sub>p,m</sub>. Is this acceptable?</p>`,
    choices: [`No, only shares work`, `Yes; the "shares add up" constraint becomes &sum;<sub>m</sub> y<sub>p,m</sub> = D<sub>p</sub>W<sub>p</sub> and every other ingredient can still be written linearly, giving the same optimal profit`, `Yes, but the model becomes nonlinear`, `No, because y has units`],
    answer: 1,
    explanation: `<p>Several choices of decisions can work: q (share of weight), z (kg per item), y (total kg). What matters is whether every ingredient (objective, constraints) can be expressed, linearly, without an exploding number of decisions. With y the supply constraint is &sum;<sub>p</sub> y<sub>p,m</sub> &le; K<sub>m</sub> and the cost is &sum;<sub>m</sub> c<sub>m</sub> &sum;<sub>p</sub> y<sub>p,m</sub>. Every correct model has the same optimum, $851.31M.</p>`,
    concept: "lp-decisions"
  },
  {
    id: "lp06", topic: "lp-blocks", area: "opt", type: "write", source: "Lululime Q1",
    prompt: `<p>Lululime. Sets P (products) and M (materials: virgin poly, recycled poly, conventional cotton, organic cotton). Data: R<sub>p</sub> price, D<sub>p</sub> demand (must be met), W<sub>p</sub> weight per item, L<sup>cot</sup><sub>p</sub> and L<sup>poly</sup><sub>p</sub> minimum shares; c<sub>m</sub> cost per kg, K<sub>m</sub> supply. Pledges: at least 45% of all polyester recycled, at least 20% of all cotton organic. Write the model with q<sub>p,m</sub> = share of product p's weight made of material m.</p>`,
    explanation: `<p><b>Decisions:</b> q<sub>p,m</sub> &ge; 0 for every p &isin; P, m &isin; M.</p><p><b>Objective:</b> maximize &sum;<sub>p</sub> R<sub>p</sub>D<sub>p</sub> &minus; &sum;<sub>m</sub> c<sub>m</sub> &sum;<sub>p</sub> D<sub>p</sub>W<sub>p</sub> q<sub>p,m</sub> (revenue is a constant since all demand is met).</p><p><b>Constraints:</b></p><ul><li>shares add up: &sum;<sub>m</sub> q<sub>p,m</sub> = 1 for every p</li><li>cotton minimum: q<sub>p,ConvCot</sub> + q<sub>p,OrgCot</sub> &ge; L<sup>cot</sup><sub>p</sub> for every p (with L &gt; 0)</li><li>polyester minimum: q<sub>p,VirPoly</sub> + q<sub>p,RecPoly</sub> &ge; L<sup>poly</sup><sub>p</sub> for every p</li><li>supply: &sum;<sub>p</sub> D<sub>p</sub>W<sub>p</sub> q<sub>p,m</sub> &le; K<sub>m</sub> for every m</li><li>recycled pledge: &sum;<sub>p</sub> D<sub>p</sub>W<sub>p</sub> q<sub>p,Rec</sub> &ge; 0.45 (&sum;<sub>p</sub> D<sub>p</sub>W<sub>p</sub> q<sub>p,Rec</sub> + &sum;<sub>p</sub> D<sub>p</sub>W<sub>p</sub> q<sub>p,Vir</sub>)</li><li>organic pledge: &sum;<sub>p</sub> D<sub>p</sub>W<sub>p</sub> q<sub>p,Org</sub> &ge; 0.20 (&sum;<sub>p</sub> D<sub>p</sub>W<sub>p</sub> q<sub>p,Org</sub> + &sum;<sub>p</sub> D<sub>p</sub>W<sub>p</sub> q<sub>p,Conv</sub>)</li><li>q<sub>p,m</sub> &ge; 0</li></ul><p>The key expression: product p uses D<sub>p</sub>W<sub>p</sub>q<sub>p,m</sub> kg of material m. Pledges are ratios; multiply out the denominator.</p>`,
    concept: "lp-blocks"
  },
  {
    id: "lp07", topic: "lp-blocks", area: "opt", type: "write", source: "TeaPod practice",
    prompt: `<p>TeaPod makes four phone models m &isin; M with profit Profit<sub>m</sub>, assembly time A<sub>m</sub> and test time T<sub>m</sub> per unit; 14,000 assembly hours and 4,000 test hours available; at most 12,000 displays in total, of which at most 7,000 touch displays (used by Active and iPlus). All output sells. Write the model, then add: (a) Classic must be at least 15% of phones; (b) up to 2,500 overtime test hours can be bought at $50 each.</p>`,
    explanation: `<p><b>Decisions:</b> X<sub>m</sub> &ge; 0 phones of model m. <b>Objective:</b> maximize &sum;<sub>m</sub> Profit<sub>m</sub>X<sub>m</sub>. <b>Constraints:</b> &sum;<sub>m</sub> A<sub>m</sub>X<sub>m</sub> &le; 14,000; &sum;<sub>m</sub> T<sub>m</sub>X<sub>m</sub> &le; 4,000; &sum;<sub>m</sub> X<sub>m</sub> &le; 12,000; X<sub>Active</sub> + X<sub>iPlus</sub> &le; 7,000; X<sub>m</sub> &ge; 0. (Profit $640,000: displays and test time bind.)</p><p>(a) X<sub>Classic</sub> / &sum;<sub>m</sub>X<sub>m</sub> &ge; 0.15 is a ratio; write X<sub>Classic</sub> &ge; 0.15 &sum;<sub>m</sub> X<sub>m</sub>. Costs $18,000 (Classic displaces Slim one for one).</p><p>(b) New decision Y &ge; 0 overtime hours; objective &minus; 50Y; test constraint &sum;<sub>m</sub> T<sub>m</sub>X<sub>m</sub> &le; 4,000 + Y; Y &le; 2,500. The "capacity expandable at a cost" pattern: one new variable on the RHS, its cost in the objective, its own cap. Only 2,000 hours are used because assembly then binds.</p>`,
    concept: "lp-blocks"
  },
  {
    id: "lp08", topic: "lp-blocks", area: "opt", type: "write", source: "Assignment 3 Scroogle",
    prompt: `<p>Scroogle shows one ad per visit. Profiles U, advertisers A. Data: C<sub>u,a</sub> click rate, P<sub>u,a</sub> payment per click, S<sub>u,a</sub> ad quality, B<sub>a</sub> monthly budget, T<sub>u</sub> monthly visits, L = 3.5 minimum average quality of displayed ads. Maximize revenue. Write the model.</p>`,
    explanation: `<p><b>Decisions:</b> x<sub>u,a</sub> &ge; 0 ads of advertiser a shown to profile u per month.</p><p><b>Objective:</b> maximize &sum;<sub>u</sub>&sum;<sub>a</sub> P<sub>u,a</sub> C<sub>u,a</sub> x<sub>u,a</sub> (a typical revenue term is ads &times; click rate &times; payment per click).</p><p><b>Constraints:</b> budget &sum;<sub>u</sub> P<sub>u,a</sub>C<sub>u,a</sub>x<sub>u,a</sub> &le; B<sub>a</sub> for every a; traffic &sum;<sub>a</sub> x<sub>u,a</sub> &le; T<sub>u</sub> for every u; average quality &sum;<sub>u</sub>&sum;<sub>a</sub> S<sub>u,a</sub>x<sub>u,a</sub> &ge; L &sum;<sub>u</sub>&sum;<sub>a</sub> x<sub>u,a</sub> (ratio multiplied out); x &ge; 0.</p><p>Revenue $13,589.79; four budgets, four traffic limits and the quality constraint bind. Because the constraint is on the overall average, the model concentrates low-quality paying ads on some profiles.</p>`,
    concept: "lp-blocks"
  },

  /* =========================================================
     OPTIMIZATION: LINEARITY AND RATIOS
     ========================================================= */
  {
    id: "lp09", topic: "lp-linear", area: "opt", type: "mc", source: "Handout section 2",
    prompt: `<p>Which of these expressions is <b>linear</b> in the decisions x<sub>t</sub> (p<sub>t</sub> and s<sub>t</sub> are data)?</p>`,
    choices: [`x<sub>Elm</sub> / (x<sub>Elm</sub> + x<sub>Maple</sub>)`, `&sum;<sub>t</sub> p<sub>t</sub> s<sub>t</sub> x<sub>t</sub>`, `x<sub>Elm</sub> &times; x<sub>Maple</sub>`, `max(x<sub>Elm</sub>, 30)`],
    answer: 1,
    explanation: `<p>A product of any number of data items times one decision is linear: the coefficient p<sub>t</sub>s<sub>t</sub> is just a number. Ratios of decisions, products of decisions, and max/min/if applied to decisions are all nonlinear. Dividing by data (x/100) is fine; dividing by a decision is not.</p>`,
    concept: "lp-linear"
  },
  {
    id: "lp10", topic: "lp-linear", area: "opt", type: "mc", source: "Lululime Q5",
    prompt: `<p>Lululime now also chooses production S<sub>p</sub> alongside the shares q<sub>p,m</sub>. The material cost &sum;<sub>m</sub> c<sub>m</sub> &sum;<sub>p</sub> S<sub>p</sub> W<sub>p</sub> q<sub>p,m</sub> is:</p>`,
    choices: [`Linear, because W<sub>p</sub> and c<sub>m</sub> are data`, `Nonlinear, because S<sub>p</sub> &times; q<sub>p,m</sub> multiplies two decisions; switching to y<sub>p,m</sub> = kg of m in p restores linearity`, `Linear as long as S<sub>p</sub> is continuous`, `Nonlinear, and nothing can be done`],
    answer: 1,
    explanation: `<p>Whether a model is linear can depend on the choice of decisions. With y<sub>p,m</sub> the cost is &sum;<sub>m</sub> c<sub>m</sub> &sum;<sub>p</sub> y<sub>p,m</sub>, demand becomes &sum;<sub>m</sub> y<sub>p,m</sub> &le; D<sub>p</sub>W<sub>p</sub>, and the design minimums become multiplied-out ratios. When a model turns nonlinear, consider different or more decisions.</p>`,
    concept: "lp-linear"
  },
  {
    id: "lp11", topic: "lp-linear", area: "opt", type: "write", source: "Lululime Q1",
    prompt: `<p>Write the pledge "at least 45% of all polyester is recycled" first as stated, then in a form a linear model accepts, with X = total recycled polyester and Y = total virgin polyester (both linear expressions of the decisions). Why is the rewrite valid?</p>`,
    explanation: `<p>As stated: X / (X + Y) &ge; 0.45, nonlinear because decisions sit in the denominator. Multiply through: <b>X &ge; 0.45 (X + Y)</b>, or 0.55X &minus; 0.45Y &ge; 0. Valid because X + Y &ge; 0 for every feasible plan, so multiplying both sides keeps the inequality direction (handout &sect;4.1; the direction would flip if the denominator were negative). In Gurobi, never divide two expressions; write <code>lhs >= 0.45 * rhs</code>.</p>`,
    concept: "lp-ratio"
  },
  {
    id: "lp12", topic: "lp-linear", area: "opt", type: "write", source: "Gasoline blending practice",
    prompt: `<p>Blending: X<sub>p,c</sub> barrels of crude c used in product p; Octane<sub>c</sub> is data; the octane of a blend is the volume-weighted average of its crudes. Write "product p has octane at least MinOctane<sub>p</sub>" linearly, for every p.</p>`,
    explanation: `<p>As a ratio: &sum;<sub>c</sub> Octane<sub>c</sub> X<sub>p,c</sub> / &sum;<sub>c</sub> X<sub>p,c</sub> &ge; MinOctane<sub>p</sub>. Multiplied out: <b>&sum;<sub>c</sub> Octane<sub>c</sub> X<sub>p,c</sub> &ge; MinOctane<sub>p</sub> &sum;<sub>c</sub> X<sub>p,c</sub> for every p &isin; P</b>. Equivalent: &sum;<sub>c</sub> (Octane<sub>c</sub> &minus; MinOctane<sub>p</sub>) X<sub>p,c</sub> &ge; 0. A maximum-content spec ("lead at most 1") uses the same trick with &le;. If a product is not produced the constraint reads 0 &ge; 0, harmless.</p>`,
    concept: "lp-ratio"
  },
  {
    id: "lp13", topic: "lp-linear", area: "opt", type: "mc", source: "2025 midterm P1 Q3",
    prompt: `<p>Scroogle must now serve 100% of each region's traffic and minimize the largest average latency across regions. Which is a correct linear formulation of the average latency of region r?</p>`,
    choices: [`&sum;<sub>d</sub> Latency<sub>r,d</sub> x<sub>r,d</sub> / &sum;<sub>d</sub> x<sub>r,d</sub>`, `&sum;<sub>d</sub> Latency<sub>r,d</sub> x<sub>r,d</sub> / Traffic<sub>r</sub>`, `max<sub>d</sub> Latency<sub>r,d</sub>`, `&sum;<sub>d</sub> Latency<sub>r,d</sub>`],
    answer: 1,
    explanation: `<p>Since all traffic must be served, &sum;<sub>d</sub> x<sub>r,d</sub> = Traffic<sub>r</sub>, and dividing by <b>data</b> keeps the expression linear. Dividing by the sum of decisions (a) would not. The full model: add M, minimize M, M &ge; &sum;<sub>d</sub> Latency<sub>r,d</sub> x<sub>r,d</sub> / Traffic<sub>r</sub> for every r, with &sum;<sub>d</sub> x<sub>r,d</sub> = Traffic<sub>r</sub>.</p>`,
    concept: "lp-ratio"
  },
  {
    id: "lp14", topic: "lp-linear", area: "opt", type: "tf", source: "Prosche Q3",
    prompt: `<p>True or false: the fill-rate requirement "retailer r receives at least F of its pre-orders D<sub>r</sub>", &sum;<sub>c</sub> y<sub>c,r</sub> / D<sub>r</sub> &ge; F, makes the Prosche model nonlinear.</p>`,
    choices: [`True`, `False`],
    answer: 1,
    explanation: `<p>False. The denominator D<sub>r</sub> is data, so the constraint is already linear: &sum;<sub>c</sub> y<sub>c,r</sub> &ge; F D<sub>r</sub> for every r. Only a ratio whose denominator contains decisions needs the multiply-out treatment. (With F = 75% the model is infeasible: 7,000 cars cannot give 9,650 pre-orders a 75% fill rate; the largest feasible F is 72.5%.)</p>`,
    concept: "lp-ratio"
  },

  /* =========================================================
     OPTIMIZATION: STATUS, BINDING, SLACK, MULTIPLE OPTIMA, IIS
     ========================================================= */
  {
    id: "lp15", topic: "lp-status", area: "opt", type: "mc", source: "Review slides",
    prompt: `<p>In Gurobi, a non-binding &ge; constraint has slack that is:</p>`,
    choices: [`Positive`, `Negative`, `Zero`, `Undefined`],
    answer: 1,
    explanation: `<p>Gurobi reports slack = RHS &minus; LHS. For a non-binding &ge; constraint the LHS exceeds the RHS, so the slack is negative (Diet: protein slack &minus;61.7 means 61.7 g more than the 56 g minimum). A non-binding &le; constraint has positive slack (unused capacity); binding constraints of any sense and all equalities have slack 0. Other software reports absolute values.</p>`,
    concept: "lp-status"
  },
  {
    id: "lp16", topic: "lp-status", area: "opt", type: "short", source: "Lululime Q2",
    prompt: `<p>From the Lululime status table: "supply Virgin polyester: LHS 1.956, sense &lt;, RHS 10, slack 8.044" and "Min cotton Weekend Hoodie: LHS 1.000, sense &gt;, RHS 0.60, slack &minus;0.400". Interpret both and say which is binding.</p>`,
    explanation: `<p>Neither is binding. Virgin polyester: 1.956 of 10 million kg used, 8.044 unused (positive slack on a &le;). Weekend Hoodie: 100% cotton against a 60% design minimum, 40 points above it (negative slack on a &ge;). The binding constraints in that solution were all six "shares add up" equalities, the Blend Tee cotton minimum, the Performance Tee and Studio Leggings polyester minimums, the recycled polyester supply, and both pledges.</p>`,
    concept: "lp-status"
  },
  {
    id: "lp17", topic: "lp-status", area: "opt", type: "short", source: "Lululime Q2(c)",
    prompt: `<p>Cotton costs more than polyester, yet the optimal Lululime plan puts more cotton than the designs require into several products. Explain the causal chain from the binding constraints.</p>`,
    explanation: `<p>Recycled polyester supply (1.6M kg) is binding and the 45% recycled pledge is binding, so total polyester is capped at 1.6 / 0.45 = 3.56M kg. The 7.80M kg of fiber the demand requires must come from somewhere, so at least 4.24M kg must be cotton, placed in the products whose designs allow it. One scarce input, through a ratio constraint, forces a more expensive material into products that did not need it. This is why reading which constraints bind explains the plan.</p>`,
    concept: "lp-status"
  },
  {
    id: "lp18", topic: "lp-status", area: "opt", type: "mc", source: "Review slides",
    prompt: `<p>Gurobi's last log line reads "Optimal objective 8.513097778e+02". Which statement is correct?</p>`,
    choices: [`The optimal plan is unique`, `An optimal solution was found with objective 851.31, but Gurobi does not say whether other plans reach the same value`, `The model is infeasible`, `The objective is unbounded`],
    answer: 1,
    explanation: `<p>A finite optimal objective on the last line means the solve succeeded. Gurobi never reports that multiple optima exist; Lululime Q3 shows how to detect them. Infeasible models report status INFEASIBLE (then compute an IIS); unbounded models report UNBOUNDED or INF_OR_UNBD, which in a real problem means a constraint is missing.</p>`,
    concept: "lp-status"
  },
  {
    id: "lp19", topic: "lp-status", area: "opt", type: "mc", source: "Lululime Q3",
    prompt: `<p><code>optimal_ranges</code> prints that q[Blend Tee, Organic cotton] ranges from 0.000 to 0.884. Which is correct?</p>`,
    choices: [`Gurobi made an error`, `The profit changes by up to 0.884 across plans`, `Any value in that range appears in some optimal plan with the same profit of $851.31M`, `The Blend Tee must contain organic cotton`],
    answer: 2,
    explanation: `<p>The function adds the constraint profit &ge; optimum, then minimizes and maximizes each decision in turn. A range wider than zero means the decision can move without changing the profit: there are infinitely many optimal plans. Management can then choose among them by another criterion (simplicity, marketing).</p>`,
    concept: "lp-multi"
  },
  {
    id: "lp20", topic: "lp-status", area: "opt", type: "short", source: "Lululime Q3",
    prompt: `<p>Describe the procedure to check whether an LP has multiple optimal solutions. How many solves does it take for 24 decisions?</p>`,
    explanation: `<ol><li>Solve once; record the optimal objective <code>best</code>.</li><li>Add the constraint "objective &ge; best" (for a maximization), so every feasible point is now optimal for the original problem.</li><li>For every decision: minimize it, record the value; maximize it, record the value.</li><li>If the maximum exceeds the minimum for any decision, there are multiple optimal plans.</li><li>Remove the extra constraint and restore the original objective.</li></ol><p>Two solves per decision: 48 for 24 decisions (plus the restore). An alternative is to max and min a random-weighted sum of all decisions (2 solves); the weights must be random, since the plain sum of shares is 6 in every plan.</p>`,
    concept: "lp-multi"
  },
  {
    id: "lp21", topic: "lp-status", area: "opt", type: "mc", source: "Diet Q4",
    prompt: `<p>The Diet model with Marco's 17 foods, all minimums and maximums and a $7.11 budget is infeasible. The IIS has six constraints: minimums for fiber, vitamin D, calcium, magnesium; the sodium maximum; the budget. Which statement is true?</p>`,
    choices: [`Removing any one of them makes the full model feasible`, `Removing any one of them makes those six mutually consistent, but the model may still be infeasible because other IISs exist`, `The IIS lists every constraint that is wrong`, `The IIS is unique`],
    answer: 1,
    explanation: `<p>An IIS is one minimal conflicting set: any proper subset can hold together. Removing the fiber minimum produced a new 7-constraint IIS; only dropping the budget restored feasibility. Adding a cost objective produced a different IIS. The IIS does not say which constraint is "wrong": here every conflict involves the budget, so the message is that money is the binding issue.</p>`,
    concept: "lp-iis"
  },
  {
    id: "lp22", topic: "lp-status", area: "opt", type: "short", source: "Lululime Q4",
    prompt: `<p>Raising the organic pledge to 25% makes Lululime infeasible. The IIS contains the six "shares add up" constraints, the recycled polyester supply, the organic cotton supply and both pledges, but no design minimum. Explain in numbers why these cannot hold together, and give two remedies.</p>`,
    explanation: `<p>Shares binding: 7.80M kg of fiber needed. Recycled supply 1.6M and the 45% pledge: polyester at most 1.6 / 0.45 = 3.56M kg. So cotton at least 7.80 &minus; 3.56 = 4.24M kg. The 25% organic pledge needs 0.25 &times; 4.24 = 1.06M kg of organic cotton, above the 1.0M supply. The recycled pledge, which seems unrelated to organic cotton, is in the conflict.</p><p>Remedies (a management choice): pledge at most 23.6% organic (1.0 / 4.24); lower the recycled pledge to 40% (then polyester can reach 4.0M, cotton 3.80M, organic needed 0.95M); make fewer garments; buy 0.3M kg more recycled polyester. Prefer relaxing to removing.</p>`,
    concept: "lp-iis"
  },
  {
    id: "lp23", topic: "lp-status", area: "opt", type: "mc", source: "Session 7",
    prompt: `<p>Gurobi reports a model is infeasible. What should you check <b>first</b>?</p>`,
    choices: [`Buy a bigger computer`, `The model (a &ge; typed as &le;) and the data (units such as micrograms vs milligrams, an upper limit below a lower limit), before accepting genuine infeasibility`, `Remove the objective`, `Increase the number of scenarios`],
    answer: 1,
    explanation: `<p>Three reasons for infeasibility, in order of likelihood: model issues, data issues, genuine infeasibility. The instructor's own stories: a vitamin A column in micrograms instead of milligrams; a magnesium upper limit (for supplements) below the minimum (for total intake). Only then compute an IIS to see which requirements conflict.</p>`,
    concept: "lp-iis"
  },
  {
    id: "lp24", topic: "lp-status", area: "opt", type: "short", source: "Prosche Q2",
    prompt: `<p>In the corrected Prosche solution, Zuffe's capacity, C1 and C2 capacities and the FL and WW pre-orders bind; Leip and C3 have slack 2,000 and 2,500. Where would extra capacity be valuable, and where worthless? Why does Leip sit idle?</p>`,
    explanation: `<p>Extra capacity at Zuffe, C1 and C2 (binding) and extra demand from FL and WW would raise profit; extra capacity at Leip or C3 adds nothing because they are not fully used. Leip's cars cost €4,500 more to make; its profitable routes go through C1 and C2, which are full of Zuffe's cars that earn more there. Through C3 a Leip car earns only €200 at WW (71,000 &minus; 58,500 &minus; 1,800 &minus; 7,500 &minus; 3,000) and loses €1,300 at OO, and WW's pre-orders are already filled by Zuffe. Binding constraints are the scarce resources.</p>`,
    concept: "lp-status"
  },

  /* =========================================================
     OPTIMIZATION: NETWORKS
     ========================================================= */
  {
    id: "lp25", topic: "lp-network", area: "opt", type: "write", source: "Prosche Q1",
    prompt: `<p>Prosche: factories F ship cars to customization centers C, which ship to retailers R. Data: m<sub>f</sub> production cost, K<sub>f</sub> factory capacity, t<sub>f,c</sub> transport cost, s<sub>c</sub> staffing cost per car, K<sub>c</sub> center capacity, t<sub>c,r</sub> configure-and-ship cost, P<sub>r</sub> price, D<sub>r</sub> pre-orders (need not be filled). Maximize gross profit. Write the model with decisions on arcs.</p>`,
    explanation: `<p><b>Decisions:</b> x<sub>f,c</sub> &ge; 0 cars from factory f to center c; y<sub>c,r</sub> &ge; 0 cars from center c to retailer r.</p><p><b>Objective:</b> maximize &sum;<sub>c,r</sub> P<sub>r</sub> y<sub>c,r</sub> &minus; &sum;<sub>f,c</sub> (m<sub>f</sub> + t<sub>f,c</sub>) x<sub>f,c</sub> &minus; &sum;<sub>c,r</sub> (s<sub>c</sub> + t<sub>c,r</sub>) y<sub>c,r</sub>.</p><p><b>Constraints:</b></p><ul><li>factory capacity: &sum;<sub>c</sub> x<sub>f,c</sub> &le; K<sub>f</sub> for every f</li><li>center capacity: &sum;<sub>r</sub> y<sub>c,r</sub> &le; K<sub>c</sub> for every c</li><li><b>flow balance:</b> &sum;<sub>f</sub> x<sub>f,c</sub> = &sum;<sub>r</sub> y<sub>c,r</sub> for every c</li><li>pre-orders: &sum;<sub>c</sub> y<sub>c,r</sub> &le; D<sub>r</sub> for every r</li><li>x, y &ge; 0</li></ul><p>Optimum €33,625,000. Flow balance is "the constraint that is easiest to forget": without it the model sells cars nobody made.</p>`,
    concept: "lp-network"
  },
  {
    id: "lp26", topic: "lp-network", area: "opt", type: "bug", source: "Prosche Q2",
    prompt: `<p>A chatbot built the Prosche model. It reports a gross profit of €460,225,000 with zero cars produced at either factory, every center full and retailers receiving cars. Its constraint section is below. What is missing, and what three lines fix it?</p>`,
    code: `for f in factories:
    model.addConstr(produced[f] <= factory_data.loc[f, "Capacity"], name=f"capacity {f}")
for c in centers:
    model.addConstr(customized[c] <= center_data.loc[c, "Capacity"], name=f"capacity {c}")
for r in retailers:
    model.addConstr(received[r] <= retailer_data.loc[r, "Pre-orders"], name=f"pre-orders {r}")`,
    explanation: `<p>No <b>flow balance</b> at the centers: nothing requires the cars a center ships out to have arrived from the factories, so x (costly) is set to zero and y (revenue) to the maximum. Fix:</p><pre class="code">for c in centers:
    model.addConstr(gp.quicksum(x[f, c] for f in factories) == customized[c],
                    name=f"flow balance {c}")</pre><p>Method: list your own constraints from Q1 (factory capacity, center capacity, flow balance, pre-orders, non-negativity) and tick each off against the code; a sanity check on the output (zero production, absurd profit) confirms. Corrected profit: €33,625,000.</p>`,
    concept: "lp-network"
  },
  {
    id: "lp27", topic: "lp-network", area: "opt", type: "mc", source: "Prosche Q2",
    prompt: `<p>A chatbot wrote flow balance as <code>quicksum(x[f, c] for f in factories) <= customized[c]</code>. Is this right?</p>`,
    choices: [`Yes, inequalities are safer than equalities`, `No: with &le; a center could ship out more than it receives (sell unmade cars); equality is the clean statement`, `Yes, because the optimizer will make it tight`, `No, it should be &ge; only`],
    answer: 1,
    explanation: `<p>In-flow + supply = out-flow + demand at every pass-through node. With &le; in this direction, out-flow is allowed to exceed in-flow, which a profit maximizer exploits. The direction that would be harmless is out-flow &le; in-flow, but the equality is the correct and clear statement.</p>`,
    concept: "lp-network"
  },
  {
    id: "lp28", topic: "lp-network", area: "opt", type: "mc", source: "Prosche Q1",
    prompt: `<p>Instead of arc decisions, a student uses one decision s<sub>f,c,r</sub> per full path factory to center to retailer. Which statement is correct?</p>`,
    choices: [`Invalid: paths cannot express costs`, `Valid: flow balance holds by construction, but there are 24 decisions instead of 18, and in large networks the count grows as n<sup>m</sup> instead of (m&minus;1)n<sup>2</sup>`, `Valid only if all costs are zero`, `Invalid because Gurobi cannot index three lists`],
    answer: 1,
    explanation: `<p>Path decisions carry more information and need no balance constraint, but grow fast. Use arcs when cost data is per arc (Prosche); use paths when demand or price depends on the whole route (BlueSky Airlines itineraries, or if retailers wanted cars from specific centers). "Picking the right decisions is context-specific and usually the bulk of the work."</p>`,
    concept: "lp-decisions"
  },
  {
    id: "lp29", topic: "lp-network", area: "opt", type: "write", source: "Prosche Q1 variant",
    prompt: `<p>Each center can now hold cars over to next quarter. Let h<sub>c</sub> &ge; 0 be the cars left at center c at the end of the quarter. Rewrite the flow balance at the centers.</p>`,
    explanation: `<p>&sum;<sub>f</sub> x<sub>f,c</sub> = &sum;<sub>r</sub> y<sub>c,r</sub> + h<sub>c</sub> for every c &isin; C. General form: in-flow + supply = out-flow + demand, with storage counted as a form of out-flow (and a holding cost per car in the objective if given). The same shape appears in multi-period inventory balance (Alset Motors): inventory<sub>t&minus;1</sub> + production<sub>t</sub> = sales<sub>t</sub> + inventory<sub>t</sub>.</p>`,
    concept: "lp-network"
  },
  {
    id: "lp30", topic: "lp-network", area: "opt", type: "short", source: "Prosche Q3",
    prompt: `<p>The COO worries that some retailers get very few cars. Describe how to produce a profit-vs-fill-rate trade-off curve with the Prosche model, and what it showed.</p>`,
    explanation: `<p>Add one KPI as a constraint at several levels: for F = 0%, 5%, ..., 100%, rebuild the model, add &sum;<sub>c</sub> y<sub>c,r</sub> &ge; F D<sub>r</sub> for every r, optimize, record status, profit and fill rates, plot. Result: up to 25% the guarantee is free (€33.625M, only the OO/SH split changes among multiple optima); 50% costs about 2% of profit; 70% about 5%; 75% and above is infeasible since 7,000 cars cannot cover 75% of 9,650 pre-orders. Setting F is a management choice and the curve gives its price.</p>`,
    concept: "lp-network"
  },

  /* =========================================================
     OPTIMIZATION: TIERS, MAX/MIN
     ========================================================= */
  {
    id: "lp31", topic: "lp-tiers", area: "opt", type: "write", source: "Prosche Q4",
    prompt: `<p>SH will pre-order 2,000 cars and pay €72,000 for each of the first 1,600 and €69,000 for each car beyond. Modify the Prosche model (decisions y<sub>c,r</sub>) linearly.</p>`,
    explanation: `<p><b>New decisions:</b> s<sup>high</sup> &ge; 0, s<sup>low</sup> &ge; 0 (cars sold to SH at 72,000 and at 69,000).</p><p><b>Objective:</b> replace SH's revenue term with 72,000 s<sup>high</sup> + 69,000 s<sup>low</sup>.</p><p><b>Constraints:</b> &sum;<sub>c</sub> y<sub>c,SH</sub> = s<sup>high</sup> + s<sup>low</sup>; s<sup>high</sup> &le; 1,600; pre-order cap &sum;<sub>c</sub> y<sub>c,SH</sub> &le; 2,000 (or s<sup>low</sup> &le; 400).</p><p>It works because revenue is concave in volume (72,000 then 69,000) and we maximize: the optimizer fills the better tier first on its own. Profit rises by exactly 1,600 &times; 3,000 = €4.8M to €38,425,000.</p>`,
    concept: "lp-tiers"
  },
  {
    id: "lp32", topic: "lp-tiers", area: "opt", type: "mc", source: "Prosche Q5 / A3 Q4",
    prompt: `<p>FL offers €74,000 for the first 1,000 cars and €80,000 for every car beyond. Can you use the same one-decision-per-tier trick?</p>`,
    choices: [`Yes, exactly as for SH`, `No: the model would put every FL car in the €80,000 tier and overstate revenue; the revenue is convex and maximizing it needs a binary choice (gp.max_)`, `Yes, if you swap the inequality`, `No, because 1,000 is too small`],
    answer: 1,
    explanation: `<p>The trick relies on greed doing the right thing: with decreasing rates the optimizer fills the high-rate tier first. With increasing rates nothing stops it from using the better later tier first. Linear models with continuous decisions can <b>maximize concave</b> and <b>minimize convex</b> piecewise-linear functions only. The 2025 exam's AI-training loss (10,000 QPS per model for the first 10, 20,000 beyond, a cost being minimized) is convex and works: l<sub>d</sub> &le; 10, capacity &minus; (10 l<sub>d</sub> + 20 h<sub>d</sub>).</p>`,
    concept: "lp-tiers"
  },
  {
    id: "lp33", topic: "lp-tiers", area: "opt", type: "write", source: "2025 midterm P1 Q2",
    prompt: `<p>2025 exam. Training an AI model at a datacenter removes 10,000 QPS of capacity for each of the first 10 models and 20,000 QPS per model beyond the 10th. Scroogle must train 100 models in total, split across datacenters. Extend the latency-minimizing model.</p>`,
    explanation: `<p><b>New decisions:</b> l<sub>d</sub> &ge; 0 models at the low loss rate, h<sub>d</sub> &ge; 0 at the high rate, for every d.</p><p><b>New constraints:</b> &sum;<sub>d</sub> (l<sub>d</sub> + h<sub>d</sub>) = 100; capacity becomes &sum;<sub>r</sub> x<sub>r,d</sub> &le; Capacity<sub>d</sub> &minus; (10 l<sub>d</sub> + 20 h<sub>d</sub>) for every d (in thousands of QPS); l<sub>d</sub> &le; 10 for every d; l, h &ge; 0.</p><p>Why it works: the capacity loss is convex (rates increase) and the model wants to keep capacity, so it fills the cheap tier l<sub>d</sub> first. Rubric: new decisions 5, total-models constraint 3, capacity 3, l &le; 10 3, non-negativity 1.</p>`,
    concept: "lp-tiers"
  },
  {
    id: "lp34", topic: "lp-tiers", area: "opt", type: "write", source: "Handout section 4.4",
    prompt: `<p>Seedling costs are uncertain: in scenario i the costs are c<sup>i</sup><sub>t</sub>. Oro Verde is very risk averse and wants to minimize the <b>maximum</b> cost over the N scenarios. Write this linearly.</p>`,
    explanation: `<p>Add one decision C (the worst-case cost). <b>Minimize C</b> subject to C &ge; &sum;<sub>t</sub> c<sup>i</sup><sub>t</sub> x<sub>t</sub> for every scenario i = 1..N, plus the original constraints. At the optimum C equals the largest of the N expressions: larger would not be optimal, smaller would be infeasible. Mirror image: to <b>maximize a minimum</b> (worst-scenario profit, smallest fill rate), maximize R with R &le; f<sub>i</sub>(x) for every i. The 2025 exam Q3 (minimize the largest regional average latency) is exactly this pattern.</p>`,
    concept: "lp-minmax"
  },
  {
    id: "lp35", topic: "lp-tiers", area: "opt", type: "mc", source: "Handout section 4.2",
    prompt: `<p>Which constraint can be written with continuous decisions in a linear model?</p>`,
    choices: [`max(M, E, S) &ge; 30 (at least one type has 30 or more seedlings)`, `max(M, E, S) &le; 30 (no type has more than 30 seedlings)`, `min(M, E, S) &le; 5`, `None of them`],
    answer: 1,
    explanation: `<p>max(f<sub>1</sub>, ..., f<sub>m</sub>) &le; K is simply f<sub>i</sub> &le; K for every i; min(...) &ge; K is f<sub>i</sub> &ge; K for every i. The opposite directions (max &ge; K, min &le; K) are an "or" between constraints, which needs a 0/1 decision (Gurobi gp.max_/gp.min_ with binaries).</p>`,
    concept: "lp-minmax"
  },
  {
    id: "lp36", topic: "lp-tiers", area: "opt", type: "write", source: "A3 Scroogle Q3",
    prompt: `<p>Dating101 now pays per ad displayed: $0.008 for the first 200,000 ads and $0.005 beyond, with its budget unchanged. Modify the Scroogle model.</p>`,
    explanation: `<p>New decisions z<sub>first</sub>, z<sub>beyond</sub> &ge; 0. Constraints: &sum;<sub>u</sub> x<sub>u,Dating101</sub> = z<sub>first</sub> + z<sub>beyond</sub>; z<sub>first</sub> &le; 200,000. Dating101 pays 0.008 z<sub>first</sub> + 0.005 z<sub>beyond</sub>; this replaces its per-click term in the objective and in its budget constraint. Nothing forces the first tier to fill first and nothing needs to: it pays more and the model maximizes revenue. Concave, so the trick is valid.</p>`,
    concept: "lp-tiers"
  },

  /* =========================================================
     OPTIMIZATION: READING GUROBI
     ========================================================= */
  {
    id: "lp37", topic: "lp-gurobi", area: "opt", type: "bug", source: "Diet Q2 variant",
    prompt: `<p>Find the bugs in this Gurobi code for the cheapest diet meeting the minimums.</p>`,
    code: `diet = gp.Model("diet")
q = diet.addVars(foods, name="q")
diet.setObjective(gp.quicksum(food_data.loc[f, "Price_per_100g"] * q[f] for f in foods), gp.GRB.MAXIMIZE)
for n in min_nutrients:
    diet.addConstr(gp.quicksum(food_data.loc[f, n] * q[f] for f in foods) <= minimums.loc[MARCO, n], name=f"min {n}")
diet.optimize()
print(diet.ObjVal)`,
    explanation: `<ul><li>The objective must be <code>gp.GRB.MINIMIZE</code>: maximizing cost would be unbounded.</li><li>The minimum constraints must be <code>>=</code>, not <code>&lt;=</code>.</li><li><code>lb=0</code> is the default, so its absence is not a bug, but writing it documents non-negativity.</li><li>Read <code>ObjVal</code> only after checking <code>diet.Status == gp.GRB.OPTIMAL</code>.</li></ul><p>Checklist for any snippet: sense of each constraint, MIN vs MAX, quicksum present, the right list in each sum, indices in the right order, decisions where decisions belong.</p>`,
    concept: "lp-gurobi"
  },
  {
    id: "lp38", topic: "lp-gurobi", area: "opt", type: "bug", source: "Lululime variant",
    prompt: `<p>Find the bugs.</p>`,
    code: `q = plan.addVars(products, lb=0, name="q")
for p in products:
    plan.addConstr(gp.quicksum(q[p, m] for m in materials) >= 1, name=f"shares {p}")
plan.addConstr(gp.quicksum(kg_needed[p] * q[p, "Recycled polyester"] for p in products)
               / gp.quicksum(kg_needed[p] * (q[p, "Virgin polyester"] + q[p, "Recycled polyester"]) for p in products) >= 0.45)
plan.setObjective(material_cost, gp.GRB.MAXIMIZE)`,
    explanation: `<ul><li><code>addVars</code> needs both lists: <code>addVars(products, materials, lb=0, name="q")</code>, otherwise <code>q[p, m]</code> does not exist.</li><li>Shares must add to exactly one: <code>== 1</code>, not <code>>= 1</code>.</li><li>Dividing two Gurobi expressions is not allowed (nonlinear). Multiply out: <code>lhs >= 0.45 * rhs</code>.</li><li>Maximizing material cost is backwards: <code>revenue - material_cost</code> with MAXIMIZE, or <code>material_cost</code> with MINIMIZE (revenue is constant).</li><li>Give the pledge a <code>name=</code> so you can read its status later.</li></ul>`,
    concept: "lp-gurobi"
  },
  {
    id: "lp39", topic: "lp-gurobi", area: "opt", type: "bug", source: "Prosche variant",
    prompt: `<p><code>x = model.addVars(factories, centers, lb=0, name="x")</code>. Later the code computes the transport cost as below. What fails, and how do you fix it?</p>`,
    code: `cost_to_centers = gp.quicksum(factory_to_center_cost.loc[f, c] * x[c, f]
                              for f in factories for c in centers)`,
    explanation: `<p><code>x[c, f]</code> raises a KeyError: the decisions are keyed in the order the lists were given to <code>addVars</code>, (factory, center), so the index must be <code>x[f, c]</code>. Index order bugs are silent when both lists happen to share names, so always check that each decision's subscripts match its definition.</p>`,
    concept: "lp-gurobi"
  },
  {
    id: "lp40", topic: "lp-gurobi", area: "opt", type: "short", source: "Python prep notebook",
    prompt: `<p>Map each Gurobi call to the block of the model it implements: <code>addVars(tree_types, lb=0)</code>, <code>setObjective(expr, GRB.MINIMIZE)</code>, <code>for t in tree_types: addConstr(x[t] <= 40)</code>, <code>optimize()</code>, <code>x[t].X</code>, <code>con.Slack</code>, <code>computeIIS()</code>.</p>`,
    explanation: `<ul><li><code>addVars(list, lb=0)</code>: the decisions block, one non-negative decision per element (two lists give one per pair).</li><li><code>setObjective(gp.quicksum(...), GRB.MINIMIZE)</code>: the objective block.</li><li>a for loop with <code>addConstr</code>: a family of constraints "for every t in T".</li><li><code>optimize()</code>: solve; then check <code>model.Status == gp.GRB.OPTIMAL</code>.</li><li><code>x[t].X</code> and <code>model.ObjVal</code>: optimal decisions and objective.</li><li><code>con.Slack</code>: RHS &minus; LHS, zero when binding.</li><li><code>computeIIS()</code> then <code>con.IISConstr</code>: after an INFEASIBLE status, which constraints conflict.</li></ul>`,
    concept: "lp-gurobi"
  },
  {
    id: "lp41", topic: "lp-gurobi", area: "opt", type: "output", source: "Oro Verde small model, variant (water 2,700)",
    prompt: `<p>Read the model. In words, what does it minimize and what are its constraints? If the solution is Maple 0, Elm 40, Spruce 20 with cost $440, which constraints are binding?</p>`,
    code: `x = model.addVars(tree_types, lb=0, name="x")          # Maple 10.0, Elm 6.5, Spruce 9.0 per tree
model.setObjective(gp.quicksum(data.loc[t, "Cost"] * x[t] for t in tree_types), gp.GRB.MINIMIZE)
model.addConstr(gp.quicksum(x[t] for t in tree_types) >= 60, name="trees")
model.addConstr(gp.quicksum(data.loc[t, "Water"] * x[t] for t in tree_types) <= 2_700, name="water")  # 76, 48, 34
for t in tree_types:
    model.addConstr(x[t] <= 40, name=f"nursery_{t}")`,
    explanation: `<p>Minimize the seedling cost subject to: at least 60 trees in total; water used at most 2,700; at most 40 trees of each type; non-negativity.</p><p>Plug the solution into every constraint. Trees: 0 + 40 + 20 = 60 = RHS, <b>binding</b>. Water: 48 &times; 40 + 34 &times; 20 = 2,600 &le; 2,700, slack 100, not binding. Nursery: Elm 40 = 40, <b>binding</b>; Maple 0 and Spruce 20 are below 40, not binding. Cost check: 6.5 &times; 40 + 9 &times; 20 = 440. The plan makes sense: Elm is the cheapest tree, so the model buys all 40 it can and fills the rest with the next cheapest, Spruce. If any constraint came out violated, the reported solution would be wrong.</p>`,
    concept: "lp-gurobi"
  },
  {
    id: "lp42", topic: "lp-gurobi", area: "opt", type: "mc", source: "Review slides",
    prompt: `<p>What is the Gurobi equivalent of the math "&sum;<sub>f&isin;F</sub>&sum;<sub>c&isin;C</sub> TransportCost<sub>f,c</sub> x<sub>f,c</sub>"?</p>`,
    choices: [`<code>sum(cost.loc[f, c] * x[f, c] for f in factories for c in centers)</code>`, `<code>gp.quicksum(cost.loc[f, c] * x[f, c] for f in factories for c in centers)</code>`, `<code>gp.quicksum(cost.loc[f, c] for f in factories) * x</code>`, `<code>cost * x</code>`],
    answer: 1,
    explanation: `<p><code>quicksum</code> is Gurobi's <code>sum</code> for expressions that contain decisions, with identical generator syntax: one term for every (factory, center) pair. Plain <code>sum</code> often works but is slow and not idiomatic; the other options do not multiply each cost by its matching decision.</p>`,
    concept: "lp-gurobi"
  },
  {
    id: "lp43", topic: "lp-gurobi", area: "opt", type: "mc", source: "Lululime Q4",
    prompt: `<p>In the <code>print_iis</code> helper, why is <code>model.Params.DualReductions = 0</code> set before optimizing?</p>`,
    choices: [`To make the solve faster`, `So Gurobi reports INFEASIBLE rather than the ambiguous INF_OR_UNBD, which tells you whether to compute an IIS`, `To force integer solutions`, `To remove the objective`],
    answer: 1,
    explanation: `<p>Gurobi's presolve can only conclude "infeasible or unbounded" in some cases; turning off dual reductions makes it distinguish the two. An infeasible model has no solution, so the IIS table shows constraint names, senses and RHS but no LHS or slack columns.</p>`,
    concept: "lp-status"
  },
  {
    id: "lp44", topic: "lp-gurobi", area: "opt", type: "short", source: "Prosche Q4 code",
    prompt: `<p>Explain what each line does.</p>`,
    code: `model.getConstrByName("pre-orders SH").RHS = 2_000
s = model.addVars(["high", "low"], lb=0, name="s")
sh_cars = gp.quicksum(y[c, "SH"] for c in centers)
model.addConstr(sh_cars == s["high"] + s["low"], name="SH cars")
model.addConstr(s["high"] <= 1_600, name="SH high tier")
profit = model.getObjective()
model.setObjective(profit - 69_000 * sh_cars + 72_000 * s["high"] + 69_000 * s["low"], gp.GRB.MAXIMIZE)`,
    explanation: `<ol><li>Changes the right-hand side of an existing constraint, found by name, to 2,000.</li><li>Adds two new non-negative decisions keyed "high" and "low".</li><li>Builds the expression "cars shipped to SH" from existing decisions.</li><li>Links the new decisions to the old ones: the tiers add up to the cars delivered.</li><li>Caps the high tier at 1,600.</li><li>Retrieves the current objective as an expression.</li><li>Replaces SH's old revenue (69,000 per car) by the tiered revenue and re-sets the objective.</li></ol><p>Output: 1,600 cars at 72,000, 100 at 69,000, profit €38,425,000.</p>`,
    concept: "lp-gurobi"
  },
];
