import os

from fastapi import Depends
from jwtdown_fastapi.authentication import Authenticator
from passlib.context import CryptContext
from queries.accounts import AccountOut, AccountOutWithPassword, AccountQueries


class MyAuthenticator(Authenticator):
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    async def get_account_data(
        self,
        username: str,
        accounts: AccountQueries,
        # = Depends()
    ):
        return accounts.get(username)

    def get_account_getter(
        self,
        accounts: AccountQueries = Depends(),
    ):
        # Return the accounts. That's it.
        return accounts

    def get_hashed_password(self, account: AccountOutWithPassword):
        # Return the encrypted password value from your
        # account object
        return account.hashed_password

    def get_account_data_for_cookie(self, account: AccountOut):
        # Return the username and the data for the cookie.
        # You must return TWO values from this method.
        if isinstance(account, dict):
            account = AccountOutWithPassword(**account)

        return account.username, account.dict()

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)


authenticator = MyAuthenticator(os.environ["SIGNING_KEY"])
