const { Component, Fragment } = require('inferno');
const Works = require('./common/works');

module.exports = class extends Component {
  
    render() {
        const { config, page, helper } = this.props;
       
        return <Fragment>
        <Works config={config} page={page} helper={helper} index={false} />
        </Fragment>
    }
};