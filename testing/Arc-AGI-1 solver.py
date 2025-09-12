import numpy as np
from typing import List

def solve_arc_agi_1(input_grid: List[List[int]]) -> List[List[int]]:
    """
    Solves the classic ARC-AGI-1 task by identifying a block of a specified size
    and copying it to a new grid of the same size, filling the rest with 0s.
    
    This version is corrected to copy the entire bounding box of the block,
    rather than assuming its size.

    Args:
        input_grid: A 2D list of integers representing the input grid.

    Returns:
        A 2D list of integers representing the solved output grid.
    """
    input_array = np.array(input_grid)
    rows, cols = input_array.shape

    # Find the non-zero block
    non_zero_indices = np.argwhere(input_array != 0)
    if non_zero_indices.size == 0:
        return np.zeros((rows, cols), dtype=int).tolist()

    # Get the bounding box of the non-zero block
    min_row, min_col = non_zero_indices.min(axis=0)
    max_row, max_col = non_zero_indices.max(axis=0)

    # Create the output grid filled with the background color (0)
    output_array = np.zeros((rows, cols), dtype=int)

    # Corrected slicing logic: Copy the non-zero block's entire bounding box
    output_array[min_row:max_row + 1, min_col:max_col + 1] = input_array[min_row:max_row + 1, min_col:max_col + 1]

    return output_array.tolist()

# Example usage
if __name__ == '__main__':
    example_input = [
        [0, 0, 0, 0, 0],
        [0, 8, 8, 8, 0],
        [0, 8, 8, 8, 0],
        [0, 8, 8, 8, 0],
        [0, 0, 0, 0, 0]
    ]
    print("Input Grid:")
    for row in example_input:
        print(row)
    solved_grid = solve_arc_agi_1(example_input)
    print("\nSolved Grid (Corrected):")
    for row in solved_grid:
        print(row)
