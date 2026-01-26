import type { AppleModel } from "@core/apple/apple.model";

export interface StatusInfo {
	type: "success" | "warning" | "error";
	label: string;
	detail: string;
}

/**
 * Get status info based on Apple account state
 * This function can be reused across different components that need to display Apple account status
 */
export const getAppleStatusInfo = (
	account: AppleModel.ConnectedResponseType,
): StatusInfo => {
	// Check contract status
	const contractStatus = account.contractStatus || [];

	if (contractStatus.includes("PAID_APP_AGREEMENT_ACTIVE")) {
		return {
			type: "success",
			label: "Active",
			detail:
				"Your Apple Developer account is connected and ready to publish paid apps.",
		};
	} else if (contractStatus.includes("FREE_APP_AGREEMENT_ACTIVE")) {
		return {
			type: "success",
			label: "Active (Free Apps Only)",
			detail:
				"Your Apple Developer account is connected. Sign the Paid Apps Agreement to publish paid apps.",
		};
	} else if (
		contractStatus.includes("PAID_APP_AGREEMENT_OUTDATED") ||
		contractStatus.includes("FREE_APP_AGREEMENT_OUTDATED")
	) {
		return {
			type: "warning",
			label: "Agreement Update Required",
			detail:
				"Your developer agreements need to be updated. Visit App Store Connect to renew.",
		};
	} else if (contractStatus.includes("EXPIRED_MEMBERSHIP")) {
		return {
			type: "error",
			label: "Membership Expired",
			detail:
				"Your Apple Developer Program membership has expired. Please renew to continue publishing apps.",
		};
	}

	// Default case - connected but no specific contract status
	return {
		type: "success",
		label: "Active",
		detail: "Your Apple Developer account is connected.",
	};
};
