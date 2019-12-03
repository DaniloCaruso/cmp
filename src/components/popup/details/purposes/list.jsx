import { h } from "preact";
import cx from "classnames";
import PropTypes from "prop-types";

import { Label } from "../../../label";
import style from "./purposes.less";

export const PurposeList = (
	{ allPurposes, selectedPurposeIndex, purposes, onPurposeClick },
	{ theme }
) => (
	<div class={style.purposeList}>
		{allPurposes.map((purpose, i) => {
			const isActive = selectedPurposeIndex === i;
			const itemStyles = isActive
				? {
						backgroundColor: theme.activeTabBackground || theme.colorPrimary,
						color: theme.activeTabTextColor || "white",
						borderColor: theme.colorBorder
				  }
				: {
						backgroundColor:
							theme.inactiveTabBackground || theme.colorSecondary,
						color: theme.inactiveTabTextColor || theme.colorTextSecondary,
						borderColor: theme.colorBorder,
						borderRightWidth: 1,
						borderRightStyle: "solid",
						fontWeight: "bold"
				  };

			return (
				<div
					class={cx({
						[style.purposeItem]: true,
						[style.selectedPurpose]: isActive
					})}
					style={{ ...itemStyles, fontFamily: theme.fontFamily }}
					onClick={onPurposeClick(i)}
				>
					<Label
						localizeKey={`purposes.${
							i >= purposes.length ? "customPurpose" : "purpose"
						}${purpose.id}.menu`}
					>
						{purpose.name}
					</Label>
				</div>
			);
		})}
	</div>
);

PurposeList.contextTypes = {
	theme: PropTypes.object.isRequired
};