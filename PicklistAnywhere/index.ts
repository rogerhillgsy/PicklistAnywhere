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
    private _context : ComponentFramework.Context<IInputs>;
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
        context.parameters.optionsList.raw?.split(",").forEach( o => { 
            this.availableOptions.push({key: o.toString(), text: o.toString()});
        });
        this.renderControl( context);
    }
    
    private renderControl( context : ComponentFramework.Context<IInputs> ) {
        let attributeType2 = "";
        attributeType2 = context.parameters.targetAttribute.type + "";
        const t = context.parameters.targetAttribute.type === "Whole.None";

        if(context.parameters.targetAttribute.type === "Whole.None" ){
            // currentValue = typeof context.parameters.targetAttribute?.raw === 'string' && context.parameters.targetAttribute.raw.toString() !== '0'
            // ? context.parameters.targetAttribute.raw.toString()
            // : "-1";
            this.currentValue = context.parameters.targetAttribute.raw as number;
            console.log("Attribute Type: " +  context.parameters.targetAttribute.type);
        }
        else if(context.parameters.targetAttribute.type === "SingleLine.Text"){
            this.currentValue = typeof context.parameters.targetAttribute?.raw === 'string' && context.parameters.targetAttribute.raw.toString() != "" 
            ? context.parameters.targetAttribute.raw
            : "-1";
            console.log("Attribute Type2: " +  context.parameters.targetAttribute.type);
        }

        console.log(`Current value is ${this.currentValue}`);
        const selector = React.createElement( Picklist,  {
            selectedValue: this.currentValue?.toString() ?? "-1",
            availableOptions: [{key: "-1", text: '---'}, ...this.availableOptions],
            isDisabled: context.mode.isControlDisabled,
            onChange: (selectedOption?: IDropdownOption) => {
                if (typeof selectedOption === 'undefined' || selectedOption.key === -1) {
					this.currentValue = undefined;
				} else {
                    if (context.parameters.targetAttribute.type === "Whole.None" ){
                        this.currentValue = selectedOption.key as number
                    } else if(context.parameters.targetAttribute.type === "SingleLine.Text"){
                        this.currentValue = selectedOption.key as string
                    } else {
                        this.currentValue = undefined;
                    }
				}

				this.notifyOutputChanged();
            }
        })
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
        return { targetAttribute: this.currentValue};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        ReactDom.unmountComponentAtNode(this.container);
    }
}
