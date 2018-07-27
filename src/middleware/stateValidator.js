import tv4 from 'tv4';
import schema from './stateSchema';


export default ({dispatch, getState}) => (next) => (action) => {
  next(action);

  const valid = tv4.validate(getState(), schema);
  if (!valid) {
    console.error(`Schema validation failed. ${tv4.error.message} at ${tv4.error.dataPath}`);
  }
}