import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDom from "react-dom";
import { IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { Picklist } from "./Picklist";

export class PicklistAnywhere implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private container: HTMLDivElement;
    private availableOptions: IDropdownOption[];
    private currentValue?: string | number;
    private _context: ComponentFramework.Context<IInputs>;
    private attributeType: string;
    /**
     * Empty constructor.
     */
    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.availableOptions = [];
        this._context = context;
        const attributes = context.parameters.targetAttribute.attributes as { Type?: string } | undefined;
        this.attributeType = attributes?.Type ?? "";
        context.parameters.optionsList.raw?.split(",").forEach((o) => {
            switch (this.attributeType) {
                case "integer":
                    this.availableOptions.push({ key: parseInt(o), text: o });
                    break;
                case "decimal":
                case "money":
                case "double":
                    this.availableOptions.push({ key: parseFloat(o), text: o });
                    break;
                case "string":
                    this.availableOptions.push({ key: o, text: o });
                    break;
                default:
                    console.log(`Unexpected attribute type ${this.attributeType}`);
            }
        }); 
        this.renderControl(context);
    }

    private readonly numericTypes = new Set(["integer", "decimal", "money", "double"]);

    private renderControl(context: ComponentFramework.Context<IInputs>) {
        if (this.attributeType === "integer" || this.attributeType === "decimal") {
            this.currentValue = context.parameters.targetAttribute.raw as number;
        } else if (this.attributeType === "string") {
            this.currentValue = (context.parameters.targetAttribute.raw as string) ?? "undefined";
        }

        const selector = React.createElement(Picklist, {
            selectedValue: this.currentValue ?? "undefined",
            availableOptions: [{ key: "undefined", text: "---" }, ...this.availableOptions],
            isDisabled: context.mode.isControlDisabled,
            onChange: (selectedOption?: IDropdownOption) => {
                if (typeof selectedOption === "undefined" || selectedOption.key === "undefined") {
                    this.currentValue = undefined;
                } else {
                    if (this.numericTypes.has(this.attributeType)) {
                        this.currentValue = selectedOption.key as number;
                    } else if (this.attributeType == "string") {
                        this.currentValue = selectedOption.key as string;
                    } else {
                        this.currentValue = undefined;
                    }
                }

                this.notifyOutputChanged();
            },
        });
        return selector;
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        return this.renderControl(context);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return { targetAttribute: this.currentValue === "undefined" ? null : this.currentValue };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        ReactDom.unmountComponentAtNode(this.container);
    }
}
