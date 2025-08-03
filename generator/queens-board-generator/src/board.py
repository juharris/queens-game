import numpy as np
from numpy.typing import NDArray

import json


class Board:
    @classmethod
    def from_size(cls, size: int) -> 'Board':
        assert size < 2**8
        grid = np.zeros((size, size), dtype=np.int8)
        result = Board(grid)
        return result

    def __init__(self, colors: NDArray[np.int8]):
        self.colors = colors

    def __str__(self) -> str:
        return json.dumps(self.colors.tolist())
