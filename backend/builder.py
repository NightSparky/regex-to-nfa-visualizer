EPS = 'ε'

class NFA:
    def __init__(self, start, end, trans):
        self.start = start
        self.end = end
        self.trans = trans

def reset_counter():
    global count
    count = 0

def new_state():
    global count
    s = f"q{count}"
    count += 1
    return s

def symbol_nfa(sym):
    s, e = new_state(), new_state()
    return NFA(s, e, [(s, sym, e)])

def concat(n1, n2):
    n1.trans.append((n1.end, EPS, n2.start))
    return NFA(n1.start, n2.end, n1.trans + n2.trans)

def union(n1, n2):
    s, e = new_state(), new_state()
    trans = [(s, EPS, n1.start), (s, EPS, n2.start),
             (n1.end, EPS, e), (n2.end, EPS, e)]
    return NFA(s, e, n1.trans + n2.trans + trans)

def star(n):
    s, e = new_state(), new_state()
    trans = [(s, EPS, e), (s, EPS, n.start),
             (n.end, EPS, n.start), (n.end, EPS, e)]
    return NFA(s, e, n.trans + trans)

def postfix_to_nfa(postfix):
    st = []
    for c in postfix:
        if c == '*':
            st.append(star(st.pop()))
        elif c == '.':
            b, a = st.pop(), st.pop()
            st.append(concat(a, b))
        elif c == '|':
            b, a = st.pop(), st.pop()
            st.append(union(a, b))
        else:
            st.append(symbol_nfa(c))
    return st.pop()

def nfa_to_dict(nfa):
    states = sorted({s for t in nfa.trans for s in (t[0], t[2])})
    transitions = [{"from": a, "to": b, "symbol": s} for a, s, b in nfa.trans]
    return {
        "states": states,
        "start": nfa.start,
        "accept": nfa.end,
        "transitions": transitions
    }