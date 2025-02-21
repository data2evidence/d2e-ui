sap.ui.define([
    "jquery.sap.global",
    "./utils/Enum",
    "./utils/TokenDefinition"
], function (jQuery, Enum, TokenDefinition) {
    "use strict";

    /**
     * List of TokenDefinitions for the VariantConstraint.
     * @namespace
     * @alias sap.hc.mri.pa.ui.lib.VariantConstraintTokenDefinition
     */
    var VariantConstraintTokenDefinition = {};

    VariantConstraintTokenDefinition.tokens = Enum.build("CHR", "COLON", "DASH", "NUMBER");

    VariantConstraintTokenDefinition.tokenDefinitions = [
        new TokenDefinition(/^chr(1[0-9]|2[0-1]|[1-9]|x|y)/i, VariantConstraintTokenDefinition.tokens.CHR),
        new TokenDefinition(/^:/, VariantConstraintTokenDefinition.tokens.COLON),
        new TokenDefinition(/^-/, VariantConstraintTokenDefinition.tokens.DASH),
        new TokenDefinition(/^\d+/, VariantConstraintTokenDefinition.tokens.NUMBER)
    ];

    return VariantConstraintTokenDefinition;
}, true);
