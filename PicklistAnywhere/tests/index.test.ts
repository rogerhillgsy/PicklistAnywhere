/*
 * Test the top level index.ts file.
 */
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
//import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react";
import { PicklistAnywhere } from "../index";
import { IInputs } from "../generated/ManifestTypes";
import mock from "jest-mock-extended/lib/Mock";

describe("Test top level index.ts", () => {
    const accountId = "20000000-14fb-4fcb-93ea-bf3a7e0bdc25";
    const dynamicsServer = "https://contoso.crm.dynamics.com";

    test( "Create a basic control", () => {
        const picklistControl = new PicklistAnywhere();

        const context = mock<ComponentFramework.Context<IInputs> >();
        // const context = mock<ComponentFramework.Context<IInputs> | {page : { entityTypeName: string, entityId: string}}>();
        const outputChanged = jest.fn(); // mock<() => void>();
        const state = mock<ComponentFramework.Dictionary>();

        (context as any).page = { entityTypeName: "account", entityId: accountId };
        const getClientUrl = jest.fn();
        getClientUrl.mockReturnValue(dynamicsServer);
        (context as any).page.getClientUrl = getClientUrl;
      //  context.webAPI = mock<WebApi>();
        context.parameters.optionsList = mock<IInputs["optionsList"]>();
        context.parameters.optionsList.raw = "10,20";
        context.parameters.targetAttribute = mock<IInputs["targetAttribute"]>();
        context.parameters.targetAttribute.raw = "10";
        context.parameters.targetAttribute.attributes = { Type: "integer" } as unknown as ComponentFramework.PropertyHelper.FieldPropertyMetadata.Metadata;
        
        // var y = new ComponentFramework.PropertyHelper.FieldPropertyMetadata.Metadata();
        context.parameters.targetAttribute.attributes = 
              mock<ComponentFramework.PropertyHelper.FieldPropertyMetadata.Metadata>();
        context.utils = mock<ComponentFramework.Utility>();

        jest.setTimeout(200000);
        picklistControl.init(context, outputChanged, state);
        const component = picklistControl.updateView(context);
        render(component);

      // Assert
      // Output changed should not be called (yet).
      expect(outputChanged.mock.calls).toHaveLength(0);

    });
});