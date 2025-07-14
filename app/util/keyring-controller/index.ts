import {
  SignTypedDataVersion,
  TypedMessageParams,
} from '@metamask/keyring-controller';
import Engine from '../../core/Engine';

export async function signTypedMessage(
  messageParams: TypedMessageParams,
  opts: SignTypedDataVersion,
) {
  const { KeyringController } = Engine.context;

  return await KeyringController.signTypedMessage(messageParams, opts);
}
