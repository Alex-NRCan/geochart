import Ajv from 'ajv';
import SCHEMA_DATA from './schema-validator-data.json';
import SCHEMA_OPTIONS from './schema-validator-options.json';

/**
 * Represents the result of a Chart data or options inputs validations.
 */
export type ValidatorResult = {
  valid: boolean;
  errors?: string[];
};

/**
 * The Schema Validator class to validate json objects.
 */
export class SchemaValidator {
  // The embedded JSON validator
  private ajv: Ajv.Ajv;

  /**
   * Constructs a Chart Validate object to validate schemas.
   */
  constructor() {
    // The embedded JSON validator
    this.ajv = new Ajv();
  }

  /**
   * Validates the data input parameters.
   * @param data object the data json object to validate
   */
  validateData = (data: object): ValidatorResult => {
    // Redirect
    return this.validateJsonSchema(SCHEMA_DATA, data);
  };

  /**
   * Validates the options input parameters.
   * @param options object the options json object to validate
   */
  validateOptions = (options: object): ValidatorResult => {
    // Redirect
    return this.validateJsonSchema(SCHEMA_OPTIONS, options);
  };

  /**
   * Validates the a jsonObj using a schema validator.
   * @param schema object the schema validator json to validate the jsonObj with
   * @param jsonObj object the json object to validate
   */
  validateJsonSchema = (schema: object, jsonObj: object): ValidatorResult => {
    // Compile
    const validate = this.ajv.compile(schema);

    // Validate
    const valid = validate(jsonObj) as boolean;

    // Return a ValidatorResult
    return {
      valid,
      errors: validate.errors?.map((e: Ajv.ErrorObject) => {
        const m = e.message || 'generic schema error';
        return `${e.schemaPath} | ${e.keyword} | ${m}`;
      }),
    };
  };

  /**
   * Returns a string representation of the errors of all ValidatorResult objects.
   * @param valRes ValidatorResult[] the list of validation results to read and put to string
   */
  public static parseValidatorResultsMessages = (valRes: ValidatorResult[]): string => {
    // Gather all error messages for data input
    let msg = '';
    valRes.forEach((v) => {
      // Redirect
      msg += SchemaValidator.parseValidatorResultMessage(v);
    });
    return msg.replace(/^\n+|\n+$/gm, '');
  };

  /**
   * Returns a string representation of the error in the ValidatorResult object.
   * @param valRes ValidatorResult the validation result to read and put to string
   */
  public static parseValidatorResultMessage = (valRes: ValidatorResult): string => {
    // Gather all error messages for data input
    let msg = '';
    valRes.errors?.forEach((m: string) => {
      msg += `${m}\n`;
    });
    return msg.replace(/^\n+|\n+$/gm, '');
  };
}