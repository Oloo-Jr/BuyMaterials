import React, { useEffect, useState } from 'react';
import logo from '../../Assets/rekebisha-logo-reverse 1.png'
import { auth } from '../../Database/config';
import { Menubar } from 'primereact/menubar';
import { Link } from 'react-router-dom';

export default function MainHeader() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  const items = [
    {
      label: 'Home',
      url: '/home'
    },
    {
      label: 'Agents',
      items: [
        {
          label: 'Fundi Agents',
          url: '/fundi'
        },
        {
          label: 'Jua Kali Agents',
          url: '/hardware'
        },
        {
          label: 'DotDot Agents',
          url: '#'
        },
        {
          label: 'Property Agents',
          url: '#'
        }
      ]
    },
    {
      label: 'Register',
      items: [
        {
          label: 'Register Fundi',
          url: '/register-fundi'
        },
        {
          label: 'Register Dotdot',
          url: '/dotdotsignup'
        },
        {
          label: 'Register Jua Kali',
          url: '/materialsignup'
        },
        {
          label: 'Register Property',
          url: '/rentalsignup'
        },
      ]
    },
    {
      label: 'Orders',
      items: [
        {
          label: 'Fundi',
          url: '/fundiorders'
        },
        {
          label: 'DotDot',
        },
      ]
    },
    {
      label: 'Admins',
      url: '/admins'
    },
    {
      label: 'Payments',
      url: '/payments'
    },
  ];

  const handleSignOut = (e) => {
    e.preventDefault();
    auth
      .signOut()
      .then(() => {
        window.location.href = '/';
      })
      .catch(error => alert(error.message))
  }

  return (
    <div className='bg-[#17304a] flex items-center sm:px-20 px-2 py-4 justify-between' >
      <Link to='#'>
        <img src={logo} className='sm:h-12 h-8 w-auto' alt='Rekebisha' />
      </Link>

      {user && <Menubar className='text-sm' model={items}></Menubar>}

      {user && <div className='bg-red-600 text-white sm:text-sm text-[12px] rounded px-4 py-2 cursor-pointer font-medium flex gap-2' onClick={handleSignOut}>
        <div>Sign Out</div>
      </div>}

    </div>
  )
}