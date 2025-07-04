import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skeleton/SidebarSkeleton';
import { Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {

    const { users, getUsers, setSelectedUser, isUsersLoading, selectedUser } = useChatStore();

    const { onlineUsers } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false)

    useEffect(() => {
        getUsers()
    }, [getUsers])

    const handleOnlineUsersToggle = () => {
        setShowOnlineOnly(!showOnlineOnly);
    }
    const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)) : users;

    if (isUsersLoading) return <SidebarSkeleton />


    return (
        <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>

            {/* Header section */}
            <div className='border-b border-base-300 w-full p-5'>
                <div className='flex items-center gap-2'>
                    <Users className='size-6' />
                    <span className='font-medium hidden lg:block'>Contacts</span>
                </div>

                {/* Todo : online filter toggel */}
            </div>

            <fieldset className="fieldset  w-64  p-4">
                <label className="label">
                    <input type="checkbox" className="toggle toggle-success" onChange={() => handleOnlineUsersToggle()} />
                    Show online only <span className='text-xs text-zinc-500'>({onlineUsers.length - 1} online)</span>
                </label>

            </fieldset>

            {/* Users section */}
            <div className='overflow-y-auto w-full py-3'>
                {filteredUsers && filteredUsers.map((user) => (
                    <button
                        key={user?._id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
                        ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""} `} >

                        {/* Profile image and dot for online user */}
                        <div className='relative mx-auto lg:mx-0'>
                            <img
                                src={user?.profilePic || "/avatar.png"}
                                alt={user?.fullName}
                                className='size-12 object-cover rounded-full'
                            />
                            {onlineUsers.includes(user?._id) && (
                                <span className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900' />
                            )}
                        </div>

                        {/* User info section - only visible for the larger screen */}
                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{user.fullName}</div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}

                {filteredUsers.length === 0 && (
                    <div className='text-center text-zinc-500 py-4'>No online users</div>
                )}
            </div>
        </aside>
    )
}

export default Sidebar
