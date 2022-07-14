// Validation
interface IValidatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: IValidatable) {
  let isValid = true;

  if(validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  if(
    validatableInput.minLength != null
    && typeof(validatableInput.value) === "string"
  ) {
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
  }

  if(
    validatableInput.maxLength != null
    && typeof(validatableInput.value) === "string"
  ) {
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
  }

  if(validatableInput.min != null && typeof(validatableInput.value) === "number") {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  if(validatableInput.max != null && typeof(validatableInput.value) === "number") {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  return isValid;
}

// autoBind decorator
function autoBind(
  // _ and _2 means that I'm not going to use this values, but I need them.
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    get() {
      return originalMethod.bind(this);
    }
  };
  return adjustedDescriptor
}

// ProjectInput Class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;

    this.configure();
    this.attach();
  }

  gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: IValidatable = {
      value: enteredTitle,
      required: true
    }

    const descriptionValidatable: IValidatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    }

    const peopleValidatable: IValidatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    }

    if(
      !validate(titleValidatable)
      || !validate(descriptionValidatable)
      || !validate(peopleValidatable)
    )
     {
      alert("Invalid input, please try again!");
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @autoBind
  private submitHandler(evt: Event) {
    evt.preventDefault();
    const userInput = this.gatherUserInput();

    if(Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      console.log(title, description, people);
      this.clearInputs();
    }
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler.bind(this));
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const projInput = new ProjectInput();