# Initialize the grid with default weight 1 (regular path)
grid_width = 29  # Columns (Z0 to A28)
grid_height = 28  # Rows (AA0 to Z0)
grid = [[1 for _ in range(grid_width)] for _ in range(grid_height)]

def coord_to_index(coord):
    letter = coord[:-2]  # Extract letter part from coordinate
    number_str = coord[-2:] if coord[-1].isdigit() else coord[-1]  # Extract number part from coordinate
    try:
        number = int(number_str)
    except ValueError:
        print("Invalid coordinate format:", coord)
        return None
    row = ord('Z') - ord(letter)  # Calculate row index from Z
    if 'A' <= letter <= 'Z':
        row += 27  # Adjust row index for AA and above
    if not (0 <= row <= 26) or not (1 <= number <= 29):  # Check if row and number are within valid range
        print("Invalid coordinate:", coord)
        return None
    return (row, number)



# Set grass areas with weight 3
grass_areas = [
    ('AA0', 'U16'), ('U0', 'T16'), ('T0', 'S13'), ('S0', 'R11'), ('R0', 'Q9'), ('Q0', 'P8'),
    ('O0', 'O7'), ('N0', 'M7'), ('M0', 'I3'), ('I0', 'G2'), ('G0', 'F2'), ('F0', 'A1'),
    ('C1', 'A5'), ('B5', 'A14'), ('Z16', 'Z28'), ('Z23', 'W28'), ('H15', 'D22'),
    ('D18', 'A22'), ('K19', 'H28'), ('L18', 'K24'), ('H25', 'A28')
]

for start, end in grass_areas:
    start_x, start_y = coord_to_index(start)
    end_x, end_y = coord_to_index(end)
    for i in range(start_x, end_x + 1):
        for j in range(start_y, end_y + 1):
            grid[i][j] = 3

# Set mound areas with weight 0 (impassable)
mound_areas = [
    ('L12', 'K14'), ('M9', 'L17'), ('Q9', 'M18'), ('P8', 'M9'), ('R10', 'Q19'),
    ('S12', 'R19'), ('T13', 'S19')
]

for start, end in mound_areas:
    start_x, start_y = coord_to_index(start)
    end_x, end_y = coord_to_index(end)
    for i in range(start_x, end_x + 1):
        for j in range(start_y, end_y + 1):
            grid[i][j] = 0

# Function to print the grid for visualization
def print_grid(grid):
    for row in grid:
        print(' '.join(str(cell) for cell in row))

# Print the grid
print_grid(grid)
