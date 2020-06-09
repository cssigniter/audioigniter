import PropTypes from 'prop-types';

const propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]).isRequired,
  rule: PropTypes.string.isRequired,
  unit: PropTypes.oneOf(['px', '%', 'em', 'rem', 'vh', 'vw', 'pt', 'cm', 'mm']),
  edgeCase: PropTypes.shape({
    edge: PropTypes.any.isRequired,
    value: PropTypes.string.isRequired,
  }),
  breakpointLimit: PropTypes.bool,
};

const Rule = () => null;

Rule.propTypes = propTypes;

export default Rule;
