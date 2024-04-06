import { FC } from 'react';
import Discord from '/images/discord.png';
import Medium from '/images/medium.png';
import Twitter from '/images/twitter.png';

export const SOCIAL = [
    {
        link: '#',
        icon: Twitter,
        text: 'Twitter',
    },
    {
        link: '#',
        icon: Medium,
        text: 'Medium',
    },
    {
        link: '#',
        icon: Discord,
        text: 'Discord',
    },
];


const SocialRow: FC = () => (
    <div className='flex items-center justify-center'>
        {SOCIAL.map(({ link, icon, text }, index) => (
            <div className='p-[0_20px]' key={index}>
                <a href={link}>
                    <img src={icon} alt={text} />
                </a>
            </div>
        ))}
    </div>
);

export default SocialRow;
