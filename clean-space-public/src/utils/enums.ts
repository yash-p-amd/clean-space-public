export enum TextEditorEvent {
    SelectAll = "SelectAll",
    Select = "Select",
    Copy = "Copy",
    CopyAll = "CopyAll",
    Paste = "Paste",
    PasteAll = "PasteAll",
    Cut = "Cut",
    CutAll = "CutAll",
    Delete = "Delete",
    DeleteAll = "DeleteAll",
    Undo = "Undo",
    Typing = "Typing",
    NewLine = "NewLine",
}

export enum KeyboardEvent {
    OnKeyDown = "OnKeyDown",
    OnKeyUp = "OnKeyUp",
    OnKeyPress = "OnKeyPress"
}

export enum Tool {
    None = "None",
    Header1 = "Header1",
    Header2 = "Header2",
    Header3 = "Header3",
    Header4 = "Header4",
    Header5 = "Header5",
    Header6 = "Header6",
    Bullet = "Bullet",
    Checkbox = "Checkbox",
    Card = "Card",
    Text = "Text",
}

export enum Key {
    ArrowUp = "ArrowUp",
    ArrowDown = "ArrowDown",
    ArrowLeft = "ArrowLeft",
    ArrowRight = "ArrowRight",
    Slash = "Slash",
    Enter = "Enter",
    Space = "Space",
    Backspace = "Backspace",
    ControlLeft = "ControlLeft",
    ControlRight = "ControlRight",
    ShiftLeft = "ShiftLeft",
    ShiftRight = "ShiftRight",
    A = "KeyA",
    C = "KeyC",
    V = "KeyV",
    X = "KeyX",
    Z = "KeyZ",
}

export enum ComponentPosition {
    InsertAfterCaret = "InsertAfterCaret",
    InsertAtCaret = "InsertAtCaret",
    InsertAtLast = "InsertAtLast",
}