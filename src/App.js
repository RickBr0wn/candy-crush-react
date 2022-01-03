import { useEffect, useState } from 'react'

const width = 8
const candyColors = ['blue', 'green', 'orange', 'purple', 'red', 'yellow']

const App = () => {
	const [currentColorArrangement, setCurrentColorArrangement] = useState([])
	const [squareBeingDragged, setSquareBeingDragged] = useState(null)
	const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)

	const createBoard = () => {
		const randomColorArrangement = []

		for (let i = 0; i < width * width; i++) {
			const randomColor =
				candyColors[Math.floor(Math.random() * candyColors.length)]

			randomColorArrangement.push(randomColor)
		}
		setCurrentColorArrangement(randomColorArrangement)
	}

	useEffect(() => {
		createBoard()
	}, [])

	const checkForColumnOfThree = () => {
		for (let i = 0; i <= 47; i++) {
			const column = [i, i + width, i + width * 2]
			const color = currentColorArrangement[i]

			if (column.every((square) => currentColorArrangement[square] === color)) {
				// All three colors in the column are identical.
				column.forEach((square) => (currentColorArrangement[square] = ''))
				return true
			}
		}
	}

	const checkForColumnOfFour = () => {
		for (let i = 0; i <= 39; i++) {
			const column = [i, i + width, i + width * 2, i + width * 3]
			const color = currentColorArrangement[i]

			if (column.every((square) => currentColorArrangement[square] === color)) {
				// All four colors in the column are identical.
				column.forEach((square) => (currentColorArrangement[square] = ''))
				return true
			}
		}
	}

	const checkForRowOfFour = () => {
		for (let i = 0; i < 56; i++) {
			const row = [i, i + 1, i + 2, i + 3]
			const color = currentColorArrangement[i]
			const notValid = [
				5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
				54, 55, 62, 63, 64
			]

			if (notValid.includes(i)) {
				continue
			}

			if (row.every((square) => currentColorArrangement[square] === color)) {
				// All four colors in the row are identical.
				row.forEach((square) => (currentColorArrangement[square] = ''))
				return true
			}
		}
	}

	const checkForRowOfThree = () => {
		for (let i = 0; i < 57; i++) {
			const row = [i, i + 1, i + 2]
			const color = currentColorArrangement[i]
			const notValid = [
				6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64
			]

			if (notValid.includes(i)) {
				continue
			}

			if (row.every((square) => currentColorArrangement[square] === color)) {
				// All four colors in the row are identical.
				row.forEach((square) => (currentColorArrangement[square] = ''))
				return true
			}
		}
	}

	const checkForEmptySpaceBelow = () => {
		for (let i = 0; i <= 55; i++) {
			const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
			const isFirstRow = firstRow.includes(i)

			if (isFirstRow && currentColorArrangement[i] === '') {
				let randomIndex = Math.floor(Math.random() * candyColors.length)
				currentColorArrangement[i] = candyColors[randomIndex]
			}

			if (currentColorArrangement[i + width] === '') {
				currentColorArrangement[i + width] = currentColorArrangement[i]
				currentColorArrangement[i] = ''
			}
		}
	}

	useEffect(() => {
		const timer = setInterval(() => {
			checkForColumnOfFour()
			checkForRowOfFour()
			checkForColumnOfThree()
			checkForRowOfThree()
			checkForEmptySpaceBelow()
			setCurrentColorArrangement([...currentColorArrangement])
		}, 100)
		return () => clearInterval(timer)
	}, [
		checkForColumnOfFour,
		checkForColumnOfThree,
		checkForRowOfFour,
		checkForRowOfThree,
		checkForEmptySpaceBelow,
		setCurrentColorArrangement
	])

	const dragStart = (e) => {
		setSquareBeingDragged(e.target)
	}

	const dragDrop = (e) => {
		setSquareBeingReplaced(e.target)
	}

	const dragEnd = () => {
		const squareBeingDraggedId = parseInt(
			squareBeingDragged.getAttribute('data-id')
		)

		const squareBeingReplacedId = parseInt(
			squareBeingReplaced.getAttribute('data-id')
		)

		currentColorArrangement[squareBeingReplacedId] =
			squareBeingDragged.style.backgroundColor
		currentColorArrangement[squareBeingDraggedId] =
			squareBeingReplaced.style.backgroundColor

		const validMoves = [
			squareBeingDraggedId - 1,
			squareBeingDraggedId - width,
			squareBeingDraggedId + 1,
			squareBeingDraggedId + width
		]

		const validMove = validMoves.includes(squareBeingReplacedId)

		const isColumnOfFour = checkForColumnOfFour()
		const isRowOfFour = checkForRowOfFour()
		const isColumnOfThree = checkForColumnOfThree()
		const isRowOfThree = checkForRowOfThree()

		if (
			squareBeingReplacedId &&
			validMove &&
			(isColumnOfFour || isColumnOfThree || isRowOfFour || isRowOfThree)
		) {
			setSquareBeingDragged(null)
			setSquareBeingReplaced(null)
		} else {
			currentColorArrangement[squareBeingReplacedId] =
				squareBeingReplaced.style.backgroundColor
			currentColorArrangement[squareBeingDraggedId] =
				squareBeingDragged.style.backgroundColor
			setCurrentColorArrangement([...currentColorArrangement])
		}
	}

	return (
		<div className='app'>
			<div className='game'>
				{currentColorArrangement &&
					currentColorArrangement.map((candyColor, index) => (
						<img
							key={index}
							style={{ backgroundColor: candyColor }}
							alt={candyColor}
							data-id={index}
							draggable={true}
							onDragStart={dragStart}
							onDragOver={(e) => e.preventDefault()}
							onDrag={(e) => e.preventDefault()}
							onDragLeave={(e) => e.preventDefault()}
							onDrop={dragDrop}
							onDragEnd={dragEnd}
						/>
					))}
			</div>
		</div>
	)
}

export default App
