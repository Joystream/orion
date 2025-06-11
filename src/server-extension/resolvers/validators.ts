import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'
import _ from 'lodash'

type SumToOptions = {
  type?: '==' | '>' | '>=' | '<' | '<='
  precision?: number
  pick?: string[]
  omit?: string[]
}

// SumTo constraint
@ValidatorConstraint({ name: 'SumTo', async: false })
class SumToConstraint implements ValidatorConstraintInterface {
  private prepareValue(obj: Record<string, number>, options: SumToOptions) {
    if (options.pick) {
      obj = _.pick(obj, options.pick)
    }
    if (options.omit) {
      obj = _.omit(obj, options.omit)
    }
    return obj
  }

  validate(obj: Record<string, number>, args: ValidationArguments) {
    const [targetSum, options] = args.constraints as [number, SumToOptions]
    obj = this.prepareValue(obj, options)
    const sum = _.round(_.sum(Object.values(obj)), options.precision ?? 8)
    switch (options.type) {
      case '>':
        return sum > targetSum
      case '>=':
        return sum >= targetSum
      case '<':
        return sum < targetSum
      case '<=':
        return sum <= targetSum
      default:
        return sum === targetSum
    }
  }

  defaultMessage(args: ValidationArguments) {
    const [targetSum, options] = args.constraints as [number, SumToOptions]
    const props = Object.keys(this.prepareValue(args.value, options))
    return `Sum of properties: ${props.join(', ')} must be ${options.type || '=='} ${targetSum}`
  }
}

// SumTo decorator
export function SumTo(
  targetSum: number,
  options?: SumToOptions,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'SumTo',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [targetSum, options || {}],
      validator: SumToConstraint,
    })
  }
}
