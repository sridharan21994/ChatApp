import React, {PropTypes} from 'react';
import Drawer from 'material-ui/Drawer';
import {spacing, typography} from 'material-ui/styles';
import {white, blue600} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import {Link} from 'react-router';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';

const styles = {
    logo: {
        cursor: 'pointer',
        fontSize: 22,
        color: typography.textFullWhite,
        lineHeight: `${spacing.desktopKeylineIncrement}px`,
        fontWeight: typography.fontWeightLight,
        backgroundColor: blue600,
        paddingLeft: 40,
        height: 56
    },
    menuItem: {
        color: '#000',
        fontSize: 14
    },
    avatar: {
        div: {
            padding: '15px 0 20px 15px',
            backgroundColor: '#dedede',
            height: 45
        },
        icon: {
            float: 'left',
            display: 'block',
            marginRight: 15,
            boxShadow: '0px 0px 0px 8px rgba(0,0,0,0.2)'
        },
        span: {
            paddingTop: 12,
            display: 'block',
            color: 'white',
            fontWeight: 300,
            textShadow: '1px 1px #444'
        }
    }
};

class LeftDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navDrawerOpen: this.props.navDrawerOpen
        };
    }

    componentWillReceiveProps(nextProps){
      this.setState({
          navDrawerOpen: nextProps.navDrawerOpen
      })
    }

    render() {

        return (
            <Drawer 
            className="left-drawer"
            open={this.state.navDrawerOpen}
            >
                <div>
                    {this.props
                        .menus
                        .map((menu, index) => (<MenuItem
                            key={index}
                            style={styles.menuItem}
                            primaryText={menu.text}
                            containerElement={< Link to = {
                            menu.link
                        } />}>
                        </MenuItem>)
                        )}
                </div>
            </Drawer>
        )
    }
};

LeftDrawer.propTypes = {
    navDrawerOpen: PropTypes.bool,
    menus: PropTypes.array,
    username: PropTypes.string
};

export default LeftDrawer;