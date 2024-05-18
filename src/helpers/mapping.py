from types import NoneType
import heapq
import utm

#takes UTM and retuns the coord grid, EX 298305, 3272438 = AA0
def utm_to_latlon(easting, northing):
    zone_number = 15
    zone_letter = 'R' 
    lat, lon = utm.to_latlon(easting, northing, zone_number, zone_letter)
    return lat, lon

# Define grid dimensions
grid_width = 29
grid_height = 27

# Initialize the grid with default weight 1 (regular path)
grid = [[1 for _ in range(grid_width)] for _ in range(grid_height)]

# Function to convert from coordinates (letter-number) to grid indices
def letter_to_index(coord):
    if coord.startswith('AA'):  # Handle AA as the top row
        return 0, int(coord[2:])
    else:
        row = ord('Z') - ord(coord[0]) + 1
        return row, int(coord[1:])

# Define grass areas and their corresponding weights
grass_areas = [
    ('AA0', 'U16'), ('U0', 'T16'), ('T0', 'S13'), ('S0', 'R11'), ('R0', 'Q9'), ('Q0', 'P8'),
    ('O0', 'O7'), ('N0', 'M7'), ('M0', 'I3'), ('I0', 'G2'), ('G0', 'F2'), ('F0', 'A1'),
    ('C1', 'A5'), ('A5', 'A14'), ('AA16', 'AA28'), ('Z23', 'X28'), ('H15', 'D22'),
    ('D18', 'A22'), ('J19', 'H28'), ('L20', 'K24'), ('H25', 'A28'), ('I18', 'H18')
]

for start, end in grass_areas:
    start_x, start_y = letter_to_index(start)
    end_x, end_y = letter_to_index(end)
    for i in range(start_x, end_x + 1):
        for j in range(start_y, end_y + 1):
            grid[i][j] = 3  # Assign weight 3 for grass areas

# Define mound areas and their corresponding weights
mound_areas = [
    ('L12', 'K14'), ('M9', 'L17'), ('Q9', 'M18'), ('P8', 'M9'), ('R10', 'Q19'),
    ('S12', 'R19'), ('T13', 'S19')
]

for start, end in mound_areas:
    start_x, start_y = letter_to_index(start)
    end_x, end_y = letter_to_index(end)
    for i in range(start_x, end_x + 1):
        for j in range(start_y, end_y + 1):
            grid[i][j] = 0  # Assign weight 0 for mound areas

# Function to print the grid for visualization
def print_grid(grid):
    for row in grid:
        print(' '.join(str(cell) for cell in row))

# Function to convert index to letter
def index_to_letter(index):
    if index == 0:
        return "AA"
    else:
        return chr(ord('A') + 26 - index - 1)

# Function to convert letter to index
def letter_to_index(letter):
    if letter == "AA":
        return 0
    else:
        return 26 - (ord(letter) - ord('A'))

# Define the graph as an adjacency list
graph = {}

# Initialize distances to all vertices as infinity
distances = {}

# Initialize predecessors to store the shortest path
predecessors = {}

for row in range(grid_height):
    for col in range(grid_width):
        # Get grid coordinates from indices
        coord = index_to_letter(row) + str(col)
        distances[coord] = float('inf')
        predecessors[coord] = None  # Initialize predecessor to None
        
        # Add neighbors for each cell
        neighbors = []
        if row > 0:
            neighbors.append(index_to_letter(row - 1) + str(col))
        if row < grid_height - 1:
            neighbors.append(index_to_letter(row + 1) + str(col))
        if col > 0:
            neighbors.append(index_to_letter(row) + str(col - 1))
        if col < grid_width - 1:
            neighbors.append(index_to_letter(row) + str(col + 1))
        
        # Set weights based on grid values
        weight = grid[row][col]
        
        graph[coord] = {neighbor: weight for neighbor in neighbors}

# Dijkstra's algorithm
def dijkstra(graph, startLat,startLong, endLat, endLong):

    Start_east = latlon_to_utm(startLat, startLong)[0]
    Start_north = latlon_to_utm(startLat, startLong)[1]
    start = indices_to_grid_coord(Start_east,Start_north)

    End_east = latlon_to_utm(endLat, endLong)[0]
    End_north = latlon_to_utm(endLat, endLong)[1]
    end = indices_to_grid_coord(End_east,End_north)

    pq = [(0, start)]
    visited = set()
    distances[start] = 0
    
    while pq:
        dist, node = heapq.heappop(pq)
        
        if node == end:
            break 
        
        if node in visited:
            continue
        
        visited.add(node)
        
        for neighbor, weight in graph[node].items():
            if distances[node] + weight < distances[neighbor]:
                distances[neighbor] = distances[node] + weight
                predecessors[neighbor] = node  # Store predecessor
                heapq.heappush(pq, (distances[neighbor], neighbor))

# Function to reconstruct the shortest path
def reconstruct_path(startLat,startLong, endLat, endLong):
    Start_east = latlon_to_utm(startLat, startLong)[0]
    Start_north = latlon_to_utm(startLat, startLong)[1]
    start = indices_to_grid_coord(Start_east,Start_north)

    End_east = latlon_to_utm(endLat, endLong)[0]
    End_north = latlon_to_utm(endLat, endLong)[1]
    end = indices_to_grid_coord(End_east,End_north)

    path = []
    node = end

    coord_path = []
    while node is not None:
        path.append(node)
        node = predecessors[node]

    for item in path[::-1]:
      east = grid_coord_to_indices(item)[0]
      north = grid_coord_to_indices(item)[1]

      coord_path.append(utm_to_latlon(east,north))

    return coord_path  # Reverse the path to start from start node


dijkstra(graph, 29.56450309149859, -95.08160062781668, 29.565412635798346, -95.08095585052985)

# Get the shortest path
shortest_path = reconstruct_path(29.56450309149859, -95.08160062781668, 29.565412635798346, -95.08095585052985)

# Print shortest distance to the end node

# Print the shortest path
print("Shortest path:", shortest_path)

#gives the UTM from the grid coords EX A28 = (298405.0, 3272330.0)
def grid_coord_to_indices(coord):
    def letter_to_index(letter):
        if letter == "AA":
            return 0
        else:
            return 26 - (ord(letter) - ord('A'))

    row_letter = ""
    col_number = ""
    for char in coord:
        if char.isalpha():
            row_letter += char
        elif char.isdigit():
            col_number += char

    col_number = int(col_number)

    row_index = letter_to_index(row_letter)
    col_index = col_number

    width_per_box = 100 / 28
    height_per_box = 108 / 26

    return 298305 + (width_per_box * col_index), 3272438 - (height_per_box * row_index)

#gives the grid coords from the UTM EX 298405,3272330 = A28
def indices_to_grid_coord(easting, northing):
    def index_to_letter(index):
        if index == 0:
            return "AA"
        else:
            return chr(ord('A') + 26 - index - 1)
    
    # Conversion parameters
    width_per_box = 100 / 28
    height_per_box = 108 / 26

    # Reference coordinates
    ref_easting = 298305
    ref_northing = 3272438

    # Calculate indices
    col_index = int((easting - ref_easting) / width_per_box)
    row_index = int((ref_northing - northing) / height_per_box)

    # Convert indices to grid coordinate parts
    row_letter = index_to_letter(row_index)
    col_number = str(col_index)

    return row_letter + col_number


#Latitude, Long to UTM converter
def latlon_to_utm(latitude, longitude):
    easting, northing, zone_number, zone_letter = utm.from_latlon(latitude, longitude)
    return easting, northing, zone_number, zone_letter
