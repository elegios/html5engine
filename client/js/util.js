function deepcopy(o) {
	return JSON.parse(JSON.stringify(o)) // TODO: I assume this can be made more performant
}

