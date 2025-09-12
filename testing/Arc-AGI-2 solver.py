import numpy as np
from typing import List

def solve_arc_agi_2(input_grid: List[List[int]]) -> List[List[int]]:
    """
    Solves the ARC-AGI-2 task with an improved center calculation
    for even-sized bounding boxes.

    Args:
        input_grid: A 2D list of integers representing the input grid.

    Returns:
        A 2D list of integers representing the solved output grid.
    """
    input_array = np.array(input_grid)
    rows, cols = input_array.shape

    # Find the non-zero cells
    non_zero_indices = np.argwhere(input_array != 0)
    if non_zero_indices.size == 0:
        return np.zeros((rows, cols), dtype=int).tolist()

    # Get the bounding box of the non-zero block
    min_row, min_col = non_zero_indices.min(axis=0)
    max_row, max_col = non_zero_indices.max(axis=0)

    # Get the color of the original block
    color = input_array[min_row, min_col]

    # Calculate the center of the bounding box with more precision
    center_row = round((min_row + max_row) / 2)
    center_col = round((min_col + max_col) / 2)

    # Create the output grid filled with the background color (0)
    output_array = np.zeros((rows, cols), dtype=int)

    # Place the core pixel at the new, more precise center
    output_array[int(center_row), int(center_col)] = color

    return output_array.tolist()

# Example usage with a typical ARC-AGI-2 input
if __name__ == '__main__':
    example_input = [
        [0, 0, 0, 0, 0, 0],
        [0, 8, 8, 8, 8, 0],
        [0, 8, 0, 0, 8, 0],
        [0, 8, 8, 8, 8, 0],
        [0, 0, 0, 0, 0, 0]
    ]

    print("Input Grid:")
    for row in example_input:
        print(row)

    solved_grid = solve_arc_agi_2(example_input)

    print("\nSolved Grid (Improved):")
    for row in solved_grid:
        print(row)
