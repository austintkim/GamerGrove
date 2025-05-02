import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Settings.css'

function Settings({ iconData, userData, onSettingsUpdate }) {
    const navigate = useNavigate()
    const [incorrectLogin, setIncorrectLogin] = useState(false)
    const [usernameTaken, setUserNameTaken] = useState(false)
    const [emailTaken, setEmailTaken] = useState(false)
    const [newPasswordTaken, setNewPasswordTaken] = useState(false)
    const [accountFormData, setAccountFormData] = useState({
        username: '',
        password: '',
        new_password: '',
        first_name: '',
        last_name: '',
        email: '',
        icon_id: '',
    })
    useEffect(() => {
        if (userData) {
            setAccountFormData({
                username: userData.username || '',
                password: '',
                new_password: '',
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                email: userData.email || '',
                icon_id: userData.icon_id || '',
            })
        }
    }, [userData])

    const [showPasswordFields, setShowPasswordFields] = useState(false)
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false)
    const [newPasswordMismatch, setNewPasswordMismatch] = useState(false)
    const [newPasswordStrength, setNewPasswordStrength] = useState(null)

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [passwordMismatch, setPasswordMismatch] = useState(false)
    const [updatedAccount, setUpdatedAccount] = useState(false)

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword)
    }

    const toggleNewConfirmPasswordVisibility = () => {
        setShowNewConfirmPassword(!showNewConfirmPassword)
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const checkNewPasswordStrength = (new_password) => {
        let strength = 0

        if (new_password.length >= 8 && /[A-Z]/.test(new_password)) strength++
        if (new_password.length >= 8 && /[a-z]/.test(new_password)) strength++
        if (new_password.length >= 8 && /[0-9]/.test(new_password)) strength++
        if (new_password.length >= 8 && /[^A-Za-z0-9]/.test(new_password))
            strength++

        const strengthLabels = {
            0: '',
            1: 'Weak',
            2: 'Moderate',
            3: 'Strong',
            4: 'Very Strong',
        }
        setNewPasswordStrength(strengthLabels[String(strength)])
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target

        setAccountFormData({
            ...accountFormData,
            [name]: value,
        })

        if (name === 'new_password') {
            checkNewPasswordStrength(value)
        }
    }

    const newPasswordConfirmChange = (e) => {
        setNewPasswordConfirm(e.target.value)
    }

    const passwordConfirmChange = (e) => {
        setPasswordConfirm(e.target.value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (
            passwordConfirm !== accountFormData.password &&
            newPasswordConfirm !== accountFormData.new_password
        ) {
            setPasswordMismatch(true)
            setNewPasswordMismatch(true)
            throw new Error('Both old and new passwords do not match!')
        }

        if (passwordConfirm !== accountFormData.password) {
            setPasswordMismatch(true)
            throw new Error('Passwords do not match!')
        }

        if (newPasswordConfirm !== accountFormData.new_password) {
            setNewPasswordMismatch(true)
            throw new Error('New passwords do not match!')
        }

        if (accountFormData.new_password && newPasswordConfirm) {
            const updateUrl = `${import.meta.env.VITE_API_HOST}/api/accounts/${
                userData.id
            }/${userData.username}`

            const updateFetchConfig = {
                method: 'put',
                body: JSON.stringify(accountFormData),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            const updateResponse = await fetch(updateUrl, updateFetchConfig)

            if (updateResponse.ok) {
                setPasswordConfirm('')
                setNewPasswordConfirm('')

                accountFormData.password = ''
                accountFormData.new_password = ''
                setAccountFormData(accountFormData)

                setShowPasswordFields(false)
                setUpdatedAccount(true)
                onSettingsUpdate()
            } else {
                const data = await updateResponse.json()
                if (
                    data.detail.includes('username') &&
                    data.detail.includes('email')
                ) {
                    setUserNameTaken(true)
                    setEmailTaken(true)
                    throw new Error(
                        'Failed to update account - both username and email are taken'
                    )
                } else if (data.detail.includes('username')) {
                    setUserNameTaken(true)
                    throw new Error(
                        'Failed to update account - username is taken'
                    )
                } else if (data.detail.includes('email')) {
                    setEmailTaken(true)
                    throw new Error('Failed to update account - email is taken')
                } if (
                    data.detail.includes('3')
                ) {
                    setIncorrectLogin(true)
                } else if (
                    data.detail.includes('4')
                ) {
                    setNewPasswordTaken(true)
                } else {
                    setIncorrectLogin(true)
                    setNewPasswordTaken(true)
                }

                throw new Error(
                    `Failed to update account settings --> ${data.detail}`
                )
            }
        } else {
            const updateUrl = `${import.meta.env.VITE_API_HOST}/api/accounts/${
                userData.id
            }/${userData.username}`

            const updateFetchConfig = {
                method: 'put',
                body: JSON.stringify(accountFormData),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            const updateResponse = await fetch(updateUrl, updateFetchConfig)
            if (updateResponse.ok) {
                accountFormData.password = ''
                accountFormData.new_password = ''
                setAccountFormData(accountFormData)
                setPasswordConfirm('')
                setNewPasswordConfirm('')
                setUpdatedAccount(true)
                onSettingsUpdate()
            } else {
                const data = await updateResponse.json()
                if (
                    data.detail.includes('username') &&
                    data.detail.includes('email')
                ) {
                    setUserNameTaken(true)
                    setEmailTaken(true)
                    throw new Error(
                        'Failed to update account - both username and email are taken'
                    )
                } else if (data.detail.includes('username')) {
                    setUserNameTaken(true)
                    throw new Error(
                        'Failed to update account - username is taken'
                    )
                } else if (data.detail.includes('email')) {
                    setEmailTaken(true)
                    throw new Error('Failed to update account - email is taken')
                } if (data.detail.includes('6')) {
                    setIncorrectLogin(true)
                }
                throw new Error(
                    `Failed to update account settings --> ${data.detail}`
                )
            }
        }
    }

    const handleDismissUsername = () => {
        const alertElement = document.getElementById('warning-message-username')
        alertElement.style.opacity = '0'
        setTimeout(() => setUserNameTaken(false), 300)
    }

    const alertStyleUsername = {
        display: usernameTaken ? 'flex' : 'none',
        maxWidth: '255px',
        padding: '5px',
        whiteSpace: 'nowrap',
        opacity: usernameTaken ? '1' : '0',
        transition: 'opacity 0.3s ease',
        margin: '0 auto',
    }

    const handleDismissEmail = () => {
        const alertElement = document.getElementById('warning-message-email')
        alertElement.style.opacity = '0'
        setTimeout(() => setEmailTaken(false), 300)
    }

    const alertStyleEmail = {
        display: emailTaken ? 'flex' : 'none',
        maxWidth: '220px',
        padding: '5px',
        whiteSpace: 'nowrap',
        opacity: emailTaken ? '1' : '0',
        transition: 'opacity 0.3s ease',
        margin: '0 auto',
    }

    const handleDismissNewPassword = () => {
        const alertElement = document.getElementById('warning-message-newpassword')
        alertElement.style.opacity = '0'
        setTimeout(() => setNewPasswordTaken(false), 300)
    }

    const alertStyleNewPassword = {
        display: newPasswordTaken ? 'flex' : 'none',
        maxWidth: '395px',
        padding: '5px',
        whiteSpace: 'nowrap',
        opacity: newPasswordTaken ? '1' : '0',
        transition: 'opacity 0.3s ease',
        margin: '0 auto',
    }

    const togglePasswordFields = () => {
        if (showPasswordFields) {
            accountFormData.new_password = ''
            setNewPasswordConfirm('')
        }
        setShowPasswordFields(!showPasswordFields)
    }

    const handleDismissIncorrectLogin = () => {
        const loginAlert = document.getElementById('failure-message')
        if (loginAlert) {
            loginAlert.style.opacity = '0'
        }
        setTimeout(() => {
            setIncorrectLogin(false)
        }, 300)
    }

    const handleDismissPassWarning = () => {
        const alertElement = document.getElementById('warning-message-pass')
        alertElement.style.opacity = '0'
        setTimeout(() => setPasswordMismatch(false), 300)
    }

    const handleDismissNewPassWarning = () => {
        const alertElement = document.getElementById('warning-message-newpass')
        alertElement.style.opacity = '0'
        setTimeout(() => setNewPasswordMismatch(false), 300)
    }

    const handleDismissSuccess = () => {
        const successElement = document.getElementById('success-message')
        successElement.style.opacity = '0'
        setTimeout(() => setUpdatedAccount(false), 300)
    }

    const alertStyle = {
        display: passwordMismatch ? 'inline-block' : 'none',
        maxWidth: '250px',
        margin: '0 auto',
        padding: '10px',
        color: 'black',
        border: '1px solid #ffeeba',
        borderRadius: '4px',
        position: 'relative',
        whiteSpace: 'nowrap',
        opacity: passwordMismatch ? '1' : '0',
        transition: 'opacity 0.3s ease',
    }

    const newAlertStyle = {
        display: newPasswordMismatch ? 'inline-block' : 'none',
        maxWidth: '250px',
        margin: '0 auto',
        padding: '10px',
        color: 'black',
        border: '1px solid #ffeeba',
        borderRadius: '4px',
        position: 'relative',
        whiteSpace: 'nowrap',
        opacity: newPasswordMismatch ? '1' : '0',
        transition: 'opacity 0.3s ease',
    }

    const failureStyle = {
        display: incorrectLogin ? 'flex' : 'none',
        maxWidth: '175px',
        margin: '0 auto',
        padding: '10px',
        color: 'black',
        border: '1px solid #ffeeba',
        borderRadius: '4px',
        position: 'relative',
        whiteSpace: 'nowrap',
        opacity: incorrectLogin ? '1' : '0',
        transition: 'opacity 0.3s ease',
    }

    const successStyle = {
        display: updatedAccount ? 'block' : 'none',
        maxWidth: '280px',
        margin: '0 auto',
        padding: '10px',
        opacity: updatedAccount ? '1' : '0',
        transition: 'opacity 0.3s ease',
    }

    let messageClasses = 'alert alert-success d-none mb-0'
    if (updatedAccount) {
        messageClasses = 'alert alert-success mb-0'
    }

    let warningNewClasses = 'alert alert-warning d-none mb-0'
    if (newPasswordMismatch) {
        warningNewClasses =
            'alert alert-warning mb-0 d-flex justify-content-between align-items-center'
    }

    let warningClasses = 'alert alert-warning d-none mb-0'
    if (passwordMismatch) {
        warningClasses =
            'alert alert-warning mb-0 d-flex justify-content-between align-items-center'
    }

    return (
        <div>
            <div style={{ alignItems: 'center' }}>
                <div className="settingscard">
                    <div className="settingscard">
                        <div
                            className="row"
                            style={{
                                backgroundColor: 'transparent',
                                paddingLeft: '11%',
                                marginLeft: '0%',
                                marginRight: '7%',
                            }}
                        >
                            <div className="settingscard">
                                <h4
                                    className="card-header"
                                    style={{ textAlign: 'center' }}
                                >
                                    Account Settings
                                </h4>
                                <form
                                    onSubmit={handleSubmit}
                                    id="create-profile"
                                >
                                    <div
                                        className="settingscard"
                                        style={{ marginBottom: '15px' }}
                                    >
                                        <label htmlFor="username">
                                            Username
                                        </label>
                                        <input
                                            onChange={handleFormChange}
                                            required
                                            type="text"
                                            name="username"
                                            id="username"
                                            className="form-control"
                                            value={accountFormData.username}
                                        />
                                    </div>
                                    <div
                                        className="alert alert-warning mb-0"
                                        id="warning-message-username"
                                        style={alertStyleUsername}
                                    >
                                        That username is already taken!
                                        <button
                                            onClick={handleDismissUsername}
                                            type="button"
                                            className="close"
                                            style={{
                                                position: 'absolute',
                                                top: '0',
                                                right: '5px',
                                                fontSize: '16px',
                                            }}
                                        >
                                            <span aria-hidden="true">
                                                &times;
                                            </span>
                                        </button>
                                    </div>
                                    <div
                                        className="form-floating mb-3"
                                        style={{ marginTop: '15px' }}
                                    >
                                        <label htmlFor="first_name">
                                            First name
                                        </label>
                                        <input
                                            onChange={handleFormChange}
                                            required
                                            type="text"
                                            name="first_name"
                                            id="first_name"
                                            className="form-control"
                                            value={accountFormData.first_name}
                                        />
                                    </div>
                                    <div className="form-floating mb-3">
                                        <label htmlFor="last_name">
                                            Last name
                                        </label>
                                        <input
                                            onChange={handleFormChange}
                                            required
                                            type="text"
                                            name="last_name"
                                            id="last_name"
                                            className="form-control"
                                            value={accountFormData.last_name}
                                        />
                                    </div>
                                    <div className="form-floating mb-3">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            onChange={handleFormChange}
                                            required
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="form-control"
                                            value={accountFormData.email}
                                            style={{ marginBottom: '15px' }}
                                        />
                                    </div>
                                    <div
                                        className="alert alert-warning mb-0"
                                        id="warning-message-email"
                                        style={alertStyleEmail}
                                    >
                                        That email is already taken!
                                        <button
                                            onClick={handleDismissEmail}
                                            type="button"
                                            className="close"
                                            style={{
                                                position: 'absolute',
                                                top: '0',
                                                right: '5px',
                                                fontSize: '16px',
                                            }}
                                        >
                                            <span aria-hidden="true">
                                                &times;
                                            </span>
                                        </button>
                                    </div>
                                    <div className="form-group">
                                        <div
                                            className="d-flex justify-content-center"
                                            style={{ marginTop: '15px' }}
                                        >
                                            <button
                                                type="button"
                                                onClick={togglePasswordFields}
                                            >
                                                {showPasswordFields
                                                    ? 'Never mind!'
                                                    : 'I want to change my password!'}
                                            </button>
                                        </div>
                                        {showPasswordFields && (
                                            <>
                                                <div className="form-floating mb-3">
                                                    <label htmlFor="new-password">
                                                        New Password
                                                    </label>
                                                    <div
                                                        style={{
                                                            position:
                                                                'relative',
                                                        }}
                                                    >
                                                        <input
                                                            onChange={
                                                                handleFormChange
                                                            }
                                                            required
                                                            type={
                                                                !showNewPassword ||
                                                                !accountFormData.new_password
                                                                    ? 'password'
                                                                    : 'text'
                                                            }
                                                            name="new_password"
                                                            id="new-password"
                                                            className="form-control"
                                                            value={
                                                                accountFormData.new_password
                                                            }
                                                            style={{
                                                                marginBottom:
                                                                    '15px',
                                                                paddingRight:
                                                                    '40px',
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                !accountFormData.new_password
                                                            }
                                                            onClick={
                                                                toggleNewPasswordVisibility
                                                            }
                                                            style={{
                                                                position:
                                                                    'absolute',
                                                                right: '10px',
                                                                top: '50%',
                                                                transform:
                                                                    'translateY(-50%)',
                                                                background:
                                                                    'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            {!showNewPassword ||
                                                            !accountFormData.new_password
                                                                ? '👁️'
                                                                : '👁️‍🗨️'}
                                                        </button>
                                                    </div>
                                                    {accountFormData.new_password &&
                                                        accountFormData
                                                            .new_password
                                                            .length < 8 && (
                                                            <p
                                                                style={{
                                                                    color: 'Red',
                                                                }}
                                                            >
                                                                Password Invalid
                                                            </p>
                                                        )}

                                                    {accountFormData.new_password &&
                                                        accountFormData
                                                            .new_password
                                                            .length >= 8 && (
                                                            <p
                                                                style={{
                                                                    color:
                                                                        newPasswordStrength ===
                                                                        'Weak'
                                                                            ? 'orange'
                                                                            : newPasswordStrength ===
                                                                              'Moderate'
                                                                            ? 'yellow'
                                                                            : newPasswordStrength ===
                                                                              'Strong'
                                                                            ? 'darkgreen'
                                                                            : 'green',
                                                                }}
                                                            >
                                                                Password
                                                                Strength:{' '}
                                                                {
                                                                    newPasswordStrength
                                                                }
                                                            </p>
                                                        )}
                                                    <div
                                                        className="alert alert-warning mb-0"
                                                        id="warning-message-newpassword"
                                                        style={
                                                            alertStyleNewPassword
                                                        }
                                                    >
                                                        Please input a password
                                                        you have not used
                                                        before!
                                                        <button
                                                            onClick={
                                                                handleDismissNewPassword
                                                            }
                                                            type="button"
                                                            className="close"
                                                            style={{
                                                                position:
                                                                    'absolute',
                                                                top: '0',
                                                                right: '5px',
                                                                fontSize:
                                                                    '16px',
                                                            }}
                                                        >
                                                            <span aria-hidden="true">
                                                                &times;
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="form-floating mb-3">
                                                    <label htmlFor="new-password-confirm">
                                                        New Password
                                                        Confirmation
                                                    </label>
                                                    <div
                                                        style={{
                                                            position:
                                                                'relative',
                                                        }}
                                                    >
                                                        <input
                                                            onChange={
                                                                newPasswordConfirmChange
                                                            }
                                                            required
                                                            type={
                                                                !showNewConfirmPassword ||
                                                                !newPasswordConfirm
                                                                    ? 'password'
                                                                    : 'text'
                                                            }
                                                            name="newPasswordConfirm"
                                                            id="new-password-confirm"
                                                            className="form-control"
                                                            value={
                                                                newPasswordConfirm
                                                            }
                                                            style={{
                                                                marginBottom:
                                                                    '15px',
                                                                paddingRight:
                                                                    '40px',
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                !newPasswordConfirm
                                                            }
                                                            onClick={
                                                                toggleNewConfirmPasswordVisibility
                                                            }
                                                            style={{
                                                                position:
                                                                    'absolute',
                                                                right: '10px',
                                                                top: '50%',
                                                                transform:
                                                                    'translateY(-50%)',
                                                                background:
                                                                    'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            {!showNewConfirmPassword ||
                                                            !newPasswordConfirm
                                                                ? '👁️'
                                                                : '👁️‍🗨️'}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div
                                                    className={
                                                        warningNewClasses
                                                    }
                                                    id="warning-message-newpass"
                                                    style={newAlertStyle}
                                                >
                                                    Your passwords do not match!
                                                    <button
                                                        onClick={
                                                            handleDismissNewPassWarning
                                                        }
                                                        type="button"
                                                        className="close"
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            top: '0',
                                                            right: '5px',
                                                            fontSize: '16px',
                                                        }}
                                                    >
                                                        <span aria-hidden="true">
                                                            &times;
                                                        </span>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <label htmlFor="icon">Icon</label>
                                        <div className="col-12 mb-3">
                                            <select
                                                onChange={handleFormChange}
                                                required
                                                name="icon_id"
                                                id="icon_id"
                                                className="form-select"
                                                value={accountFormData.icon_id}
                                            >
                                                <option value=""></option>
                                                {iconData.map((icon) => (
                                                    <option
                                                        key={icon.id}
                                                        value={icon.id}
                                                        style={{
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {icon.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div
                                            className="row justify-content-center"
                                            style={{
                                                backgroundColor: 'transparent',
                                            }}
                                        >
                                            <div className="col-12 d-flex justify-content-center align-items-center mb-3">
                                                {iconData.map((icon, index) => (
                                                    <div
                                                        key={icon.id}
                                                        className="text-center"
                                                        style={{
                                                            marginRight: '30px',
                                                        }}
                                                    >
                                                        <p>
                                                            {String.fromCharCode(
                                                                65 + index
                                                            )}
                                                        </p>
                                                        <img
                                                            src={icon.icon_url}
                                                            alt={icon.name}
                                                            width="50"
                                                            height="50"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="form-floating mb-3"
                                        style={{
                                            textAlign: 'center',
                                            marginTop: '8px',
                                        }}
                                    >
                                        <label htmlFor="password">
                                            Password
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                onChange={handleFormChange}
                                                required
                                                type={
                                                    !showPassword ||
                                                    !accountFormData.password
                                                        ? 'password'
                                                        : 'text'
                                                }
                                                name="password"
                                                id="password"
                                                className="form-control"
                                                value={accountFormData.password}
                                                style={{
                                                    marginBottom: '15px',
                                                    paddingRight: '40px',
                                                }}
                                            />
                                            <button
                                                type="button"
                                                disabled={
                                                    !accountFormData.password
                                                }
                                                onClick={
                                                    togglePasswordVisibility
                                                }
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform:
                                                        'translateY(-50%)',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {!showPassword ||
                                                !accountFormData.password
                                                    ? '👁️'
                                                    : '👁️‍🗨️'}
                                            </button>
                                        </div>
                                        <small className="form-text text-muted">
                                            Enter original password to either
                                            change it or confirm other profile
                                            settings updates
                                        </small>
                                    </div>
                                    <div
                                        className="form-floating mb-3"
                                        style={{ textAlign: 'center' }}
                                    >
                                        <label htmlFor="password">
                                            Password Confirmation
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                onChange={passwordConfirmChange}
                                                required
                                                type={
                                                    !showConfirmPassword ||
                                                    !passwordConfirm
                                                        ? 'password'
                                                        : 'text'
                                                }
                                                name="password-confirm"
                                                id="password-confirm"
                                                className="form-control"
                                                value={passwordConfirm}
                                                style={{
                                                    marginBottom: '15px',
                                                    paddingRight: '40px',
                                                }}
                                            />
                                            <button
                                                type="button"
                                                disabled={!passwordConfirm}
                                                onClick={
                                                    toggleConfirmPasswordVisibility
                                                }
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform:
                                                        'translateY(-50%)',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {!showConfirmPassword ||
                                                !passwordConfirm
                                                    ? '👁️'
                                                    : '👁️‍🗨️'}
                                            </button>
                                        </div>
                                    </div>
                                    <div
                                        className={warningClasses}
                                        id="warning-message-pass"
                                        style={alertStyle}
                                    >
                                        Your passwords do not match!
                                        <button
                                            onClick={handleDismissPassWarning}
                                            type="button"
                                            className="close"
                                            style={{
                                                position: 'absolute',
                                                top: '0',
                                                right: '5px',
                                                fontSize: '16px',
                                            }}
                                        >
                                            <span aria-hidden="true">
                                                &times;
                                            </span>
                                        </button>
                                    </div>
                                    <div
                                        className="alert alert-danger mb-0"
                                        id="failure-message"
                                        style={failureStyle}
                                    >
                                        Incorrect password...
                                        <button
                                            onClick={
                                                handleDismissIncorrectLogin
                                            }
                                            type="button"
                                            className="close"
                                            style={{
                                                position: 'absolute',
                                                top: '0',
                                                right: '5px',
                                                fontSize: '16px',
                                            }}
                                        >
                                            <span aria-hidden="true">
                                                &times;
                                            </span>
                                        </button>
                                    </div>
                                    <div className="mb-3">
                                        <button
                                            style={{ marginTop: '16px' }}
                                            disabled={
                                                !accountFormData.password ||
                                                passwordConfirm.length !=
                                                    accountFormData.password
                                                        .length ||
                                                (showPasswordFields &&
                                                    (!accountFormData.new_password ||
                                                        accountFormData
                                                            .new_password
                                                            .length < 8 ||
                                                        newPasswordStrength ===
                                                            'Weak' ||
                                                        newPasswordStrength ===
                                                            'Moderate' ||
                                                        newPasswordConfirm.length !=
                                                            accountFormData
                                                                .new_password
                                                                .length))
                                            }
                                        >
                                            Update
                                        </button>
                                    </div>
                                    <div className="mb-3">
                                        <button
                                            style={{ backgroundColor: 'red' }}
                                            type="button"
                                            onClick={() => {
                                                navigate(
                                                    `/settings/delete/${userData.id}/${userData.username}`
                                                )
                                            }}
                                        >
                                            Delete Account
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div
                                className={messageClasses}
                                id="success-message"
                                style={successStyle}
                            >
                                Your settings have been updated!
                                <button
                                    onClick={handleDismissSuccess}
                                    type="button"
                                    className="close"
                                    style={{
                                        position: 'absolute',
                                        top: '0',
                                        right: '5px',
                                        fontSize: '16px',
                                    }}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
