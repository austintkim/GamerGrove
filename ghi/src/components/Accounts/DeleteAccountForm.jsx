import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}

const buttonStyle = {
    margin: '0 10px',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
}

const greenButton = {
    ...buttonStyle,
    backgroundColor: 'green',
    color: 'white',
}

const redButton = {
    ...buttonStyle,
    backgroundColor: 'red',
    color: 'white',
}

const inputStyle = {
    marginTop: '10px',
    padding: '8px',
    borderRadius: '5px',
    width: '100%',
    border: '1px solid #ccc',
}

const DeleteAccountForm = () => {
    const navigate = useNavigate()
    const { id, username } = useParams()

    const [confirming, setConfirming] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const deleteCookie = (name, path = '/', domain = 'localhost') => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`
    }

    const handleLogOut = async () => {
        const logOutUrl = `${import.meta.env.VITE_API_HOST}/token`

        try {
            const response = await fetch(logOutUrl, {
                method: 'delete',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (response.ok) {
                deleteCookie('fastapi_token', '/')
                return true
            } else {
                throw new Error('Failed to log out')
            }
        } catch (error) {
            console.error('Error logging out:', error)
            return false
        }
    }

    const handleDelete = async (event) => {
        event.preventDefault()
        setError('')

        const deleteUrl = `${
            import.meta.env.VITE_API_HOST
        }/api/accounts/${id}/${username}`
        const deleteConfig = {
            method: 'delete',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: password }),
        }

        try {
            const response = await fetch(deleteUrl, deleteConfig)
            if (response.ok) {
                const logOutSuccess = await handleLogOut()
                if (logOutSuccess) {
                    navigate('/')
                } else {
                    console.error('Failed to log out after account deletion')
                }
            } else if (response.status === 401) {
                setError('Incorrect password. Please try again.')
            } else {
                throw new Error('Failed to delete account')
            }
        } catch (error) {
            console.error('Error deleting account:', error)
            setError('An error occurred. Please try again.')
        }
    }

    return (
        <div style={containerStyle}>
            <div className="card text-bg-light mb-3">
                <div className="card-body">
                    {!confirming ? (
                        <>
                            <div>
                                Are you sure you want to delete this account?
                            </div>
                            <button
                                style={greenButton}
                                onClick={() => setConfirming(true)}
                            >
                                Yes
                            </button>
                            <button
                                style={redButton}
                                onClick={() => navigate(-1)}
                            >
                                No
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleDelete}>
                            <div>
                                Enter your current password to confirm deletion:
                            </div>
                            <input
                                type="password"
                                style={inputStyle}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {error && (
                                <div style={{ color: 'red', marginTop: '8px' }}>
                                    {error}
                                </div>
                            )}
                            <div style={{ marginTop: '10px' }}>
                                <button type="submit" style={greenButton}>
                                    Confirm Delete
                                </button>
                                <button
                                    type="button"
                                    style={redButton}
                                    onClick={() => {
                                        setConfirming(false)
                                        setPassword('')
                                        setError('')
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DeleteAccountForm
