import {
    useEffect,
    useState,
} from 'react';
import {
    // Grid,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Grow,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import {
    useInView,
} from 'react-intersection-observer';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Unstable_Grid2';
import AuctionetIcon from '../auctionet-icon';

const ITEM_TRANSITION_STAGGER = 25;
const MAX_ITEM_LIST = 42;

const SearchTable = ({
    displayItems,
}) => {
    // if (searchItems.length <= 0) {
    //     return null;
    // }
    const [
        pageSize,
        setPageSize,
    ] = useState(MAX_ITEM_LIST);
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const errorImage = 'https://fyndmaskinen.se/images/no-image.jpg';

    const {
        ref,
        inView,
    } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        if (inView && displayItems.length > pageSize) {
            setPageSize(pageSize + MAX_ITEM_LIST);
        }
    }, [inView]);

    const tiles = displayItems.map((tile, index) => {
        let currentPrice = `${tile.currentPrice}`;

        if (tile.currentPrice === -1) {
            currentPrice = 'Förhandsvisning';
        }

        if (index >= pageSize) {
            return false;
        }

        let tileIcon = (
            <GavelIcon
            // prefersDarkMode ?
                fontSize = 'small'
            />
        );

        if (tile.type === 'tradera') {
            tileIcon = (
                <div
                    alt = 'Tradera'
                    // src = {`${process.env.PUBLIC_URL}/images/icons/tradera-100x100.png`}
                    style = {{
                        backgroundImage: `url(${process.env.PUBLIC_URL}/images/icons/tradera-40x40${prefersDarkMode ?
                            '-white' :
                            ''}.png)`,
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        height: '20px',
                        // maxWidth: '7px',
                        // transform: 'scale(4)',
                        width: '20px',
                    }}
                />
            );
        } else if (tile.type === 'auctionet') {
            tileIcon = <AuctionetIcon />;
        } else if (tile.type === 'blocket') {
            tileIcon = (
                <div
                    alt = 'Blocket'
                    style = {{
                        backgroundImage: `url(${process.env.PUBLIC_URL}/images/icons/blocket.png)`,
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        height: '20px',
                        // maxWidth: '7px',
                        // transform: 'scale(4)',
                        width: '20px',
                    }}
                />
            );
        }

        return (
            <Grow
                in
                key = {`${tile.url}`}
                // eslint-disable-next-line
                style = {{
                    transformOrigin: 'top center',
                    transitionDelay: `${(index % MAX_ITEM_LIST) * ITEM_TRANSITION_STAGGER}ms`,
                }}
            >
                <Grid
                    lg = {1}
                    md = {1}
                    spacing = {2}
                    xs = {1}
                >
                    <Card
                        key = {tile.imageUrl}
                    >
                        <CardActionArea
                            href = {tile.url}
                        >
                            <CardMedia
                                alt = {tile.title}
                                component = 'img'
                                height = {'100%'}
                                image = {`https://images.weserv.nl/?url=${ tile.imageUrl }&w=400&h=400&fit=contain&trim=10&errorredirect=${ errorImage }`}
                            />
                            <CardContent>
                                <Typography
                                    // component = 'div'
                                    color = 'text.secondary'
                                    gutterBottom
                                    sx = {{
                                        height: '32px',
                                        lineHeight: 'initial',
                                        overflow: 'hidden',
                                    }}
                                    variant = 'subtitle2'
                                >
                                    { tile.title }
                                </Typography>
                                <Typography
                                    color = 'text.secondary'
                                    component = 'span'
                                    sx = {{
                                        alignItems: 'center',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                    variant = 'body2'
                                >
                                    { new Intl.NumberFormat('sv-SE', {
                                        currency: 'SEK',
                                        minimumFractionDigits: 0,
                                        style: 'currency',
                                    }).format(currentPrice) }
                                    {tileIcon}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grow>
        );
    });

    tiles.push(<span
        key = 'ref-link'
        ref = {ref}
    />);

    return tiles;
};

export default SearchTable;
