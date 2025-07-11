import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaMoneyCheckAlt,
  FaFileInvoiceDollar,
  FaWallet,
  FaUserGraduate,
  FaBook,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
  FaBoxOpen,
  FaShoppingCart,
} from 'react-icons/fa';

const Sidebar = () => {
  const menuItems = [
    { name: 'Fee Summary', path: '/admin-dashboard/Fee Summary', icon: <FaMoneyCheckAlt /> },
    { name: 'Fee Plan', path: '/admin-dashboard/Fee Plan', icon: <FaFileInvoiceDollar /> },
    { name: 'Fee Payment', path: '/admin-dashboard/Fee Payment', icon: <FaWallet /> },
    { name: 'Students', path: '/admin-dashboard/students', icon: <FaUserGraduate /> },
    { name: 'Courses', path: '/admin-dashboard/courses', icon: <FaBook /> },
    { name: 'Users', path: '/admin-dashboard/users', icon: <FaUsers /> },
    { name: 'Profile', path: '/admin-dashboard/profile', icon: <FaUserCircle /> },
    { name: 'Logout', path: '/logout', icon: <FaSignOutAlt /> },
  ];

  const userMenuItems = [
    { name: 'Products', path: '/employee-dashboard', icon: <FaBoxOpen /> },
    { name: 'Orders', path: '/employee-dashboard/orders', icon: <FaShoppingCart /> },
    { name: 'Profile', path: '/employee-dashboard/profile', icon: <FaUserCircle /> },
    { name: 'Logout', path: '/logout', icon: <FaSignOutAlt /> },
  ];

  const [itemsToRender, setItemsToRender] = useState(userMenuItems);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('ims_user'));
    if (user && user.role === 'admin') {
      setItemsToRender(menuItems);
    }
  }, []);

  return (
    <div className="fixed h-screen bg-gray-900 text-white w-16 md:w-64 flex flex-col">
      {/* Branding */}
      <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-gray-800">
        <span className="hidden md:block text-xl font-semibold">FEE MANAGEMENT</span>
        <span className="block md:hidden text-xl font-bold">FMS</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto mt-4">
        <ul className="space-y-2 px-3 md:px-4">
          {itemsToRender.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-indigo-600' : 'hover:bg-gray-800'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span className="hidden md:block">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
    <div className="hidden md:block p-4 text-center text-xs text-gray-400 border-t border-gray-800">
  <a
    href="https://webaziz.in"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-white transition-colors"
  >
    © webaziz.in
  </a>
</div>

    </div>
  );
};

export default Sidebar;
