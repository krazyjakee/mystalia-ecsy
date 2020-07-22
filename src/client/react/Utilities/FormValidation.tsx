
export const isValidNumber = (value: any) => {
    if (Number.isNaN(Number(value))) {
      return false
    }
    return true
  }

// used to correct the value within a number input whether pasted/typed/clicked. Can be cleaned up for sure
type InputNumberProps = {
  value: any;
  min?: number | string;
  max?: number | string;
};

export const validateInputNumber = (props: InputNumberProps) => {

    if (!isValidNumber(props.value)) {
      if ( (props.min === 0 || props.min) ) {
        return Number(props.min)
      }
      return 0
    }

    if ((props.min !== 0 && !props.min) && !props.max) {
      return Number(props.value)
    }
    
    if ( (props.min === 0 || props.min) && props.max) {
      if ( (Number(props.value) < Number(props.min)) ) {
          return Number(props.min)
      } else if ( (Number(props.value) > Number(props.max))) {
          return Number(props.max)
      }
      return Number(props.value)

    } else if ( (props.min === 0 || props.min) && !props.max) {
      if ( (Number(props.value) < Number(props.min)) ) {
          return Number(props.min)
      }
      return Number(props.value)

    } else if ( (props.min !== 0 && !props.min) && props.max) {
      if ( (Number(props.value) > Number(props.max))) {
          return Number(props.max)
      }
      return Number(props.value)
    }
    return 0
};
