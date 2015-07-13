function deepcopy(o) {
	return JSON.parse(JSON.stringify(o)) // TODO: I assume this can be made more performant
}

function snapTo(n, rad, offset) {
	offset = offset ? offset : 0
	return Math.floor((n-offset) / rad) * rad + offset
}

function getCoord(n, width, offset) {
	return Math.floor((n - (offset ? offset : 0)) / width)
}

function between(low, n, high) {
	return low <= n && n <= high
}
