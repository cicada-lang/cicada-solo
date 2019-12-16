CPP=clang++

all: token_test

clean:
	rm -f *_test

token.o: token.cpp
	${CPP} $^ -c

token_test: token.cpp token_test.cpp
	${CPP} $^ -o token_test
