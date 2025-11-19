import { StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#fff',
  },
  formContainer: {
    gap: 8,
    paddingVertical: 12,
    width: 275,
    alignSelf: 'center',
  },
  divider: {
    backgroundColor: '#CCCCCC',
    height: 1,
    width: 265,
    alignSelf: 'center',
  },
  logo: {
    width: 200,
    height: 60,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#495DF9B2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 31,
    gap: 10,
    padding: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    height: 31,
    padding: 8,
    fontSize: 12,
    paddingVertical: 0, 
  },
  link: {
    color: '#4f6cf0',
  },
  text: {
    color: '#4E4E4E',
    textAlign: 'center',
    fontSize: 12,
    fontBold: '400',
  },
  textTitle: {
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    color: '#4E4E4E',
    height: 30,
    alignSelf: 'center',
  }
});