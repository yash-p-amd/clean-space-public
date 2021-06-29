export class ToolBoxEventData {
    selectedTool: Tool;
    selectedToolHtml: string;
}

export enum Tool {
    None = "None",
    Div = "Div",
    Header1 = "Header1",
    Header2 = "Header2",
    Header3 = "Header3",
    Header4 = "Header4",
    Header5 = "Header5",
    Header6 = "Header6",
    Bullet = "Bullet",
    Checkbox = "Checkbox",
    Card = "Card",
}