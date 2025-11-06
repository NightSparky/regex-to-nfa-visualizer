def insert_concat(regex):
    result = []
    symbols = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ε")
    prev = None

    for c in regex:
        if prev:
            if (prev in symbols or prev in ')*+?') and (c in symbols or c == '('):
                result.append('.')
        result.append(c)
        prev = c
    return ''.join(result)


def to_postfix(regex):
    ops = {'|': 1, '.': 2, '*': 3, '+': 3, '?': 3}
    output = []
    stack = []

    for c in regex:
        if c.isalnum() or c == 'ε':
            output.append(c)
        elif c == '(':
            stack.append(c)
        elif c == ')':
            while stack and stack[-1] != '(':
                output.append(stack.pop())
            stack.pop()
        else:
            while (stack and stack[-1] != '(' and
                   ops.get(stack[-1], 0) >= ops.get(c, 0)):
                output.append(stack.pop())
            stack.append(c)

    while stack:
        output.append(stack.pop())

    return ''.join(output)


def reg_to_postfix(regex):
    with_concat = insert_concat(regex)
    return to_postfix(with_concat)

