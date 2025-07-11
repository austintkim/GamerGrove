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
        account_getter: AccountQueries,
        # = Depends()
    ):
        return account_getter.get(username)

    def get_account_getter(
        self,
        account_getter: AccountQueries = Depends(),
    ):
        # Return the accounts. That's it.
        return account_getter

    def get_hashed_password(self, account_data: AccountOutWithPassword):  # type: ignore
        # Return the encrypted password value from your
        # account object
        return account_data.hashed_password

    def get_account_data_for_cookie(self, account_data: AccountOut):  # type: ignore
        # Return the username and the data for the cookie.
        # You must return TWO values from this method.
        if isinstance(account_data, dict):
            account_data = AccountOutWithPassword(**account_data)  # type: ignore

        return account_data.username, account_data.dict()

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)


authenticator = MyAuthenticator(os.environ["SIGNING_KEY"])
