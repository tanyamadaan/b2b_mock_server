export const SUPPORTED_DOMAINS = ["B2B", "SERVICES"];

export const USER_GUIDE_LINK = "https://github.com/tanyamadaan/b2b_mock_server/blob/feat-monorepo/README.md"; 

export const SWAGGER_BUILD_LINK =
	"https://raw.githubusercontent.com/abhik-wil/b2b_mock_server/feat-monorepo/apps/backend/src/openapi/build/swagger.yaml";
export const URL_MAPPING = {
	bpp: ["search", "select", "init", "confirm", "update", "status", "cancel"],
	bap: [
		"on_search",
		"on_select",
		"on_init",
		"on_confirm",
		"on_update",
		"on_status",
		"on_cancel",
	],
};

export const B2B_DOMAINS = [
	"ONDC:RET1A",
	"ONDC:RET1B",
	"ONDC:RET1C",
	"ONDC:RET1D",
	"ONDC:RET10",
	"ONDC:RET12",
	"ONDC:RET13",
	"ONDC:RET14"
]

export const SERVICES_DOMAINS = [
	"ONDC:SRV11",
]

export const CITY_CODE = [
	"std:080",
	"std:011"
]