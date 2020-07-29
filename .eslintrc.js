const noSpace={before:false,after:false};
module.exports = {
	env:{
		es6:true,
		browser:true
	},
	parserOptions:{
		ecmaVersion:2019,
		sourceType:"module",
		ecmaFeatures:{
			objectLiteralDuplicateProperties:false
		}
	},
	rules:{
		// possible errors
		"getter-return":1,
		"no-async-promise-executor":1,
		"no-compare-neg-zero":2,
		"no-control-regex":1,
		"no-dupe-args":2,
		"no-dupe-keys":2,
		"no-duplicate-case":1, // there are some cases (haha) where this useful
		"no-empty-character-class":2,
		"no-extra-boolean-cast":2,
		"no-extra-semi":2,
		"no-func-assign":2,
		"no-inner-declarations":1,
		"no-invalid-regexp":2,
		"no-irregular-whitespace":2,
		"no-misleading-character-class":2,
		"no-obj-calls":2,
		"no-sparse-arrays":1, // hurts performance a lot
		"no-template-curly-in-string":1, // possibly an error
		"no-unexpected-multiline":2,
		"no-unreachable":1,
		"no-unsafe-negation":2,
		"use-isnan":2,
		"valid-typeof":2,
		// best practices
		"dot-location":[2,"property"],
		"dot-notation":1,
		eqeqeq:1,
		"no-else-return":1,
		"no-empty-pattern":1,
		"no-eq-null":1,
		"no-iterator":2,
		"no-loop-func":2,
		"no-multi-spaces":2,
		"no-new-wrappers":1,
		"no-proto":2,
		"no-redeclare":2,
		"no-return-await":2, // that probably means you don't understand async/await
		"no-self-assign":2,
		"no-self-compare":2,
		"no-unused-expressions":1,
		"no-useless-call":2,
		"no-useless-catch":2,
		"no-useless-concat":2,
		"no-useless-escape":1,
		"no-useless-return":1,
		"no-with":2, // performance
		"prefer-promise-reject-errors":1,
		radix:2,
		"require-await":1, // why would you do it otherwise?
		yoda:2,
		// variables
		"no-shadow":2,
		"no-undef-init":2,
		"no-unused-vars":1,
		"no-use-before-define":2,
		// style
		"comma-dangle":[2,"never"],
		// "comma-spacing":[2,noSpace],
		"comma-style":2,
		"computed-property-spacing":2,
		"consistent-this":[1,"that"],
		"eol-last":2,
		"func-call-spacing":2,
		"func-style":[1,"declaration",{allowArrowFunctions:true}],
		indent:["error","tab",{SwitchCase:1}],
		"key-spacing":[2,{beforeColon:false,afterColon:false}],
		// "keyword-spacing":[2,noSpace],
		"linebreak-style":2,
		"no-array-constructor":2,
		"no-lonely-if":1,
		"no-mixed-spaces-and-tabs":2,
		"no-negated-condition":1,
		"no-new-object":1,
		"no-trailing-spaces":2,
		"no-unneeded-ternary":1,
		"object-curly-spacing":2,
		"no-whitespace-before-property":1,
		"operator-linebreak":[2,"before"],
		"prefer-object-spread":1,
		"quote-props":[2,"as-needed"],
		quotes:2,
		semi:2,
		"semi-spacing":2,
		"semi-style":2,
		// "space-before-blocks":[2,"never"],
		"space-before-function-paren":[2,"never"],
		"space-in-parens":2,
		"space-unary-ops":[2,{words:true,nonwords:false}],
		"spaced-comment":2,
		"switch-colon-spacing":[2,noSpace],
		// es6
		"arrow-body-style":2,
		"arrow-parens":[2,"as-needed"],
		"generator-star-spacing":[2,noSpace],
		"no-class-assign":2,
		"no-const-assign":2,
		"no-dupe-class-members":2,
		"no-duplicate-imports":1,
		"no-new-symbol":2,
		"no-this-before-super":2,
		"no-useless-computed-key":1,
		"no-useless-constructor":1,
		"no-useless-rename":1,
		"no-var":1,
		"object-shorthand":2,
		"prefer-arrow-callback":1,
		"prefer-numeric-literals":1,
		"prefer-rest-params":1,
		"prefer-spread":1,
		"require-yield":1,
		"rest-spread-spacing":2,
		"template-curly-spacing":2,
		"yield-star-spacing":[2,noSpace],
		"no-undef":"error"
	}
};
