from itertools import permutations

def neighbors(x, y, width, height):
    for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
        nx, ny = x + dx, y + dy
        if 0 <= nx < width and 0 <= ny < height:
            yield (nx, ny)

def is_hamiltonian_path(path, width, height):
    visited = set(path)
    return len(visited) == width * height and len(path) == width * height

def are_adjacent(p1, p2):
    return abs(p1[0] - p2[0]) + abs(p1[1] - p2[1]) == 1

def brute_force_hamiltonian_path(width, height, entry, exit):
    all_cells = [(x, y) for y in range(height) for x in range(width)]
    all_cells.remove(entry)
    all_cells.remove(exit)

    total_checked = 0
    for perm in permutations(all_cells):
        path = [entry] + list(perm) + [exit]
        if is_hamiltonian_path(path, width, height):
            # Check path validity: all steps are adjacent
            if all(are_adjacent(path[i], path[i+1]) for i in range(len(path)-1)):
                print(f"Checked {total_checked} permutations")
                return path
        total_checked += 1
    return None

# Example usage

entry = (0, 0)
exit = (1, 0)


for width in range(2,6):
  for height in range(width,6):
    path = brute_force_hamiltonian_path(width, height, entry, exit)
    