from collections import defaultdict

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
        self.groups: defaultdict[np.int8,
                                 list[tuple[int, int]]] = defaultdict(list)
        for i, row in enumerate(colors):
            for j, col in enumerate(row):
                self.groups[col].append((i, j))

    def __setitem__(self, key: tuple[int, int], value: np.int8):
        self.colors[key] = value
        self.groups[value].append(key)

    def __str__(self) -> str:
        groups = {k.item(): v for (k, v) in self.groups.items()}
        rep = dict(colors=self.colors.tolist(), groups=groups)
        # print(rep)
        return json.dumps(rep)
