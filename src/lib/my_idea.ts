// /foo/bar/:username/:action

export const a = {
	"foo": {
		"bar": {
			"*": {
				"*": {
					"GET": () => {},
					"POST": () => {},
				}
			}
		}
	}
}

// GET /foo/bar/:x/:y
// 